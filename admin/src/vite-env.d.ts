/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL (Project Settings → API). Without it the panel runs in demo mode. */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase publishable / anon key — safe in the browser; access is enforced by the database rules. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Public website address, for the "View website" link. */
  readonly VITE_SITE_URL?: string;
}
