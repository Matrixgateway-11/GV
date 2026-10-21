import { useCallback, useEffect, useRef, useState } from 'react';

/** Panel pages live in the URL hash: "#/", "#/enquiries", "#/enquiries/<id>". */
export function useHashPath(): [string[], (path: string) => void] {
  const read = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [segments, setSegments] = useState(read);
  useEffect(() => {
    const onChange = () => setSegments(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  const go = useCallback((path: string) => {
    window.location.hash = path;
  }, []);
  return [segments, go];
}

/** A value kept in localStorage (per browser), e.g. the "include test site" switch. */
export function useStoredState<T>(key: string, initial: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });
  const update = useCallback(
    (next: T) => {
      setValue(next);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* storage blocked — keep it for this visit only */
      }
    },
    [key],
  );
  return [value, update];
}

export type AsyncState<T> = { data: T | undefined; loading: boolean; error: string | null; reload: () => void; updatedAt: Date | null };

/**
 * Loads data and reloads whenever `deps` change. While reloading, the previous data stays on screen
 * (callers dim it), so nothing jumps or flashes.
 */
export function useAsync<T>(load: () => Promise<T>, deps: unknown[]): AsyncState<T> & { setData: (update: (data: T) => T) => void } {
  const [data, setDataState] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [nonce, setNonce] = useState(0);
  const latest = useRef(0);

  useEffect(() => {
    const call = ++latest.current;
    setLoading(true);
    setError(null);
    load()
      .then((result) => {
        if (call !== latest.current) return;
        setDataState(result);
        setUpdatedAt(new Date());
      })
      .catch((reason: unknown) => {
        if (call !== latest.current) return;
        setError(reason instanceof Error ? reason.message : typeof reason === 'object' && reason && 'message' in reason ? String(reason.message) : 'Something went wrong.');
      })
      .finally(() => {
        if (call === latest.current) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const setData = useCallback((update: (data: T) => T) => setDataState((current) => (current === undefined ? current : update(current))), []);
  return { data, loading, error, reload, updatedAt, setData };
}
