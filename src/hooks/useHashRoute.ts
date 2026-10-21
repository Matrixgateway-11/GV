import { useCallback, useEffect, useRef, useState } from 'react';

function parse(prefix: string, hash: string): string[] | null {
  if (hash === prefix) return [];
  if (!hash.startsWith(`${prefix}/`)) return null;
  return hash
    .slice(prefix.length + 1)
    .split('/')
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));
}

const toHash = (prefix: string, segments: string[]) => [prefix, ...segments.map((segment) => encodeURIComponent(segment))].join('/');

/**
 * A full-screen "page" kept in the URL hash, e.g. #request-catalog or #explore/furniture-crafts/chairs.
 *
 * `segments` is null when the page is closed, otherwise the path parts after the prefix. Pages can be opened
 * with open() or by any plain link to the hash; links can be shared, and the browser Back button closes them.
 */
export function useHashRoute(prefix: string) {
  const [segments, setSegments] = useState<string[] | null>(() => parse(prefix, window.location.hash));
  /** True when there is a history entry to go back to when closing. */
  const pushed = useRef(false);

  useEffect(() => {
    const sync = () => {
      const next = parse(prefix, window.location.hash);
      // Reaching the page by navigation (a link, or Back/Forward) means there is an entry to go back to.
      pushed.current = next !== null;
      setSegments(next);
    };
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, [prefix]);

  const open = useCallback(
    (...next: string[]) => {
      window.history.pushState(null, '', toHash(prefix, next));
      pushed.current = true;
      setSegments(next);
    },
    [prefix],
  );

  const replace = useCallback(
    (...next: string[]) => {
      window.history.replaceState(null, '', toHash(prefix, next));
      setSegments(next);
    },
    [prefix],
  );

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setSegments(null);
    }
  }, []);

  return { segments, open, replace, close };
}
