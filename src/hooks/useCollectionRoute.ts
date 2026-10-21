import { useCallback } from 'react';
import { useHashRoute } from './useHashRoute';

export type CollectionRoute = { collection: string; category: string } | null;

const parts = (collection: string, category: string) => (category === 'all' ? [collection] : [collection, category]);

/**
 * Keeps the open collection + category in the URL hash (e.g. #explore/furniture-crafts/chairs),
 * so views can be linked to directly and the browser Back button closes the viewer.
 */
export function useCollectionRoute() {
  const { segments, open: openHash, replace, close } = useHashRoute('#explore');
  const route: CollectionRoute = segments && segments[0] ? { collection: segments[0], category: segments[1] ?? 'all' } : null;

  const open = useCallback((collection: string, category = 'all') => openHash(...parts(collection, category)), [openHash]);
  const selectCategory = useCallback((collection: string, category: string) => replace(...parts(collection, category)), [replace]);

  return { route, open, selectCategory, close };
}
