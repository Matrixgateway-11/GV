-- Golden Village Furnitures — photos added from the admin panel.
--
-- This is an add-on to schema.sql: it lets the admin panel upload furniture photos
-- into any section of "Explore the Collections", and the website shows them straight
-- away without being rebuilt.
--
-- How to use: Supabase dashboard → SQL Editor → New query → paste this whole file → Run.
-- Run schema.sql first. It is safe to run this again later.

-- 1. The photos added from the admin panel -----------------------------------------------------
-- The picture files themselves live in Storage (step 3); this table only records
-- which photo belongs in which section, in what order.
create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- Which of the two collections on the website.
  collection text not null check (collection in ('furniture-crafts', 'doors-flooring')),
  -- Which tab inside that collection. These ids match src/data/collections.ts.
  category text not null check (category in (
    'chairs', 'set-collections', 'tables', 'stools-benches', 'baskets',
    'mirrors', 'crafts-decoration', 'rugs-carpets', 'doors', 'flooring'
  )),
  -- Where the files sit in the "gallery" storage bucket.
  path text not null unique,
  thumb_path text not null,
  -- Description read aloud by screen readers and shown if the photo cannot load.
  alt text not null default '',
  -- True for landscape photos: shown whole over a blurred copy instead of being cropped.
  wide boolean not null default false,
  -- Lowest first. Photos added later sort after earlier ones unless reordered.
  sort_order integer not null default 0,
  -- Untick to hide a photo from the website without deleting it.
  is_published boolean not null default true,
  -- Email of the admin who uploaded it, for the record.
  added_by text
);

create index if not exists gallery_photos_place_idx
  on public.gallery_photos (collection, category, sort_order, created_at);

-- 2. Who may change them -----------------------------------------------------------------------
-- Same rule as the rest of the panel: only emails listed in admin_users.
-- The website's own server function reads with the secret key, which bypasses these rules.
alter table public.gallery_photos enable row level security;

drop policy if exists "Admins can read gallery photos" on public.gallery_photos;
create policy "Admins can read gallery photos" on public.gallery_photos
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins can add gallery photos" on public.gallery_photos;
create policy "Admins can add gallery photos" on public.gallery_photos
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can change gallery photos" on public.gallery_photos;
create policy "Admins can change gallery photos" on public.gallery_photos
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can remove gallery photos" on public.gallery_photos;
create policy "Admins can remove gallery photos" on public.gallery_photos
  for delete to authenticated using (public.is_admin());

revoke all on public.gallery_photos from anon, authenticated;
grant select, insert, update, delete on public.gallery_photos to authenticated;
-- The website's server function reads with the secret key, which acts as service_role.
-- Without this it gets "permission denied" (SQL state 42501), which PostgREST reports as a 401.
grant select, insert, update, delete on public.gallery_photos to service_role;

-- 3. Where the picture files are kept ----------------------------------------------------------
-- A public bucket: the files are pictures on a public website, so anyone may view them,
-- but only admins may add, replace or delete them.
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update set public = true;

drop policy if exists "Anyone can view gallery files" on storage.objects;
create policy "Anyone can view gallery files" on storage.objects
  for select using (bucket_id = 'gallery');

drop policy if exists "Admins can upload gallery files" on storage.objects;
create policy "Admins can upload gallery files" on storage.objects
  for insert to authenticated with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "Admins can replace gallery files" on storage.objects;
create policy "Admins can replace gallery files" on storage.objects
  for update to authenticated using (bucket_id = 'gallery' and public.is_admin())
  with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "Admins can delete gallery files" on storage.objects;
create policy "Admins can delete gallery files" on storage.objects
  for delete to authenticated using (bucket_id = 'gallery' and public.is_admin());
