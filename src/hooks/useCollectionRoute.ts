import { useCallback, useEffect, useRef, useState } from 'react';

export type CollectionRoute = { collection: string; category: string } | null;

const PREFIX = '#explore/';

function parse(hash: string): CollectionRoute {
  if (!hash.startsWith(PREFIX)) return null;
  const [collection, category = 'all'] = hash.slice(PREFIX.length).split('/');
  return collection ? { collection, category } : null;
}

const toHash = (collection: string, category: string) => `${PREFIX}${collection}${category === 'all' ? '' : `/${category}`}`;

/**
 * Keeps the open collection + category in the URL hash (e.g. #explore/furniture-crafts/chairs),
 * so views can be linked to directly and the browser Back button closes the viewer.
 */
export function useCollectionRoute() {
  const [route, setRoute] = useState<CollectionRoute>(() => parse(window.location.hash));
  /** True when this page pushed the history entry, so closing can simply go back. */
  const pushed = useRef(false);

  useEffect(() => {
    const sync = () => {
      const next = parse(window.location.hash);
      // Reaching a view by navigation (an #explore/... link, or Forward) means there is an entry to go back to.
      pushed.current = next !== null;
      setRoute(next);
    };
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  const open = useCallback((collection: string, category = 'all') => {
    window.history.pushState(null, '', toHash(collection, category));
    pushed.current = true;
    setRoute({ collection, category });
  }, []);

  const selectCategory = useCallback((collection: string, category: string) => {
    window.history.replaceState(null, '', toHash(collection, category));
    setRoute({ collection, category });
  }, []);

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setRoute(null);
    }
  }, []);

  return { route, open, selectCategory, close };
}
