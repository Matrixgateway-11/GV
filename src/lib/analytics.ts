/**
 * Anonymous visit counting for the admin dashboard (see api/track.ts): no cookies, nothing personal.
 * Counts each visit to the site, plus each time a collection or the Request Catalog form is opened.
 */

const ENDPOINT = '/api/track';

/** "explore/doors-flooring", "request-catalog", or null for the main page. */
function viewFromHash(hash: string): string | null {
  return /^#(explore\/[a-z0-9-]+|request-catalog)/.exec(hash)?.[1] ?? null;
}

function send(kind: 'pageview' | 'open', view: string) {
  const body = JSON.stringify({ kind, view, referrer: kind === 'pageview' ? document.referrer : '' });
  try {
    if (navigator.sendBeacon?.(ENDPOINT, body)) return;
  } catch {
    /* fall back to fetch */
  }
  fetch(ENDPOINT, { method: 'POST', body, keepalive: true }).catch(() => {});
}

export function startAnalytics() {
  // Only the deployed site counts — not local development.
  if (!import.meta.env.PROD || /^(localhost|127\.|\[::1\])/.test(window.location.hostname)) return;
  let current = viewFromHash(window.location.hash);
  send('pageview', current ?? 'home');
  window.addEventListener('hashchange', () => {
    const next = viewFromHash(window.location.hash);
    if (next && next !== current) send('open', next);
    current = next;
  });
}
