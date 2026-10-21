-- Golden Village Furnitures — database for catalog enquiries, anonymous visit counts and the admin panel.
--
-- How to use: Supabase dashboard → SQL Editor → New query → paste this whole file →
-- change the email in step 5 to the one you will sign in with → Run.
-- It is safe to run again later (for example after adding another admin email).

-- 1. Who may use the admin panel ------------------------------------------------------------
create table if not exists public.admin_users (
  email text primary key check (email = lower(email)),
  added_at timestamptz not null default now()
);

-- 2. Enquiries from the website's "Request Catalog" form --------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  phone_country text,
  company text,
  country text,
  interests text[] not null default '{}',
  message text not null,
  page text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  notes text,
  ip_country text,
  -- One-way hash of the sender's IP, only used to stop floods of enquiries. The IP itself is never stored.
  ip_hash text,
  email_sent boolean not null default false,
  -- True for enquiries sent from the test (preview) website.
  is_test boolean not null default false
);
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_ip_hash_idx on public.enquiries (ip_hash, created_at);

-- 3. Anonymous visit counts (no cookies, no IP addresses, no personal data) --------------------
create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  -- 'pageview' = the website was opened; 'open' = a collection or the catalog form was opened.
  kind text not null check (kind in ('pageview', 'open')),
  view text not null,
  referrer text,
  country text,
  device text,
  -- Daily-rotating hash, so a visitor can be counted once per day but never followed across days.
  visitor_hash text,
  is_test boolean not null default false
);
create index if not exists page_views_created_at_idx on public.page_views (created_at);

-- 4. Access rules ----------------------------------------------------------------------------
-- The website's server functions write with the secret (service role) key, which bypasses these rules.
-- Signed-in users can read data only if their email is in admin_users.
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.admin_users where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

alter table public.admin_users enable row level security;
alter table public.enquiries enable row level security;
alter table public.page_views enable row level security;

drop policy if exists "Admins can see the admin list" on public.admin_users;
create policy "Admins can see the admin list" on public.admin_users
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins can read enquiries" on public.enquiries;
create policy "Admins can read enquiries" on public.enquiries
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins can update enquiries" on public.enquiries;
create policy "Admins can update enquiries" on public.enquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all on public.admin_users, public.enquiries, public.page_views from anon, authenticated;
grant select on public.admin_users to authenticated;
grant select on public.enquiries to authenticated;
-- Admins may change only the status and the internal notes of an enquiry.
grant update (status, notes) on public.enquiries to authenticated;

-- 5. Admin logins ----------------------------------------------------------------------------
-- Put the email you will sign in with (any email is fine for now; add the official ones later).
-- Then create that same user in Authentication → Users → Add user.
insert into public.admin_users (email) values (lower('you@example.com')) on conflict do nothing;

-- 6. Dashboard numbers -----------------------------------------------------------------------
-- Visits, visitors and enquiries per day / week / month for the last p_periods periods,
-- in the admin's time zone. Every period is returned, including empty ones.
create or replace function public.admin_traffic(
  p_bucket text,
  p_periods int,
  p_tz text default 'Asia/Jakarta',
  p_include_test boolean default false
)
returns table (bucket timestamp, visits bigint, visitors bigint, enquiries bigint)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
declare
  v_step interval;
  v_last timestamp;
  v_first timestamp;
  v_since timestamptz;
begin
  if not public.is_admin() then
    raise exception 'Not allowed' using errcode = '42501';
  end if;
  if p_bucket not in ('day', 'week', 'month') then
    raise exception 'Unknown period %', p_bucket;
  end if;
  v_step := ('1 ' || p_bucket)::interval;
  v_last := date_trunc(p_bucket, now() at time zone p_tz);
  v_first := v_last - v_step * (least(greatest(p_periods, 1), 400) - 1);
  v_since := v_first at time zone p_tz;

  return query
  with buckets as (
    select generate_series(v_first, v_last, v_step) as bucket
  ), v as (
    select date_trunc(p_bucket, pv.created_at at time zone p_tz) as bucket,
           count(*) as visits,
           count(distinct pv.visitor_hash) as visitors
    from public.page_views pv
    where pv.kind = 'pageview' and pv.created_at >= v_since and (p_include_test or not pv.is_test)
    group by 1
  ), e as (
    select date_trunc(p_bucket, en.created_at at time zone p_tz) as bucket, count(*) as enquiries
    from public.enquiries en
    where en.created_at >= v_since and (p_include_test or not en.is_test)
    group by 1
  )
  select b.bucket, coalesce(v.visits, 0), coalesce(v.visitors, 0), coalesce(e.enquiries, 0)
  from buckets b
  left join v on v.bucket = b.bucket
  left join e on e.bucket = b.bucket
  order by b.bucket;
end;
$$;

-- Top countries, devices, traffic sources and most-opened sections over the same periods.
create or replace function public.admin_breakdown(
  p_bucket text,
  p_periods int,
  p_tz text default 'Asia/Jakarta',
  p_include_test boolean default false
)
returns table (dimension text, label text, total bigint)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
declare
  v_since timestamptz;
begin
  if not public.is_admin() then
    raise exception 'Not allowed' using errcode = '42501';
  end if;
  if p_bucket not in ('day', 'week', 'month') then
    raise exception 'Unknown period %', p_bucket;
  end if;
  v_since := (date_trunc(p_bucket, now() at time zone p_tz)
              - ('1 ' || p_bucket)::interval * (least(greatest(p_periods, 1), 400) - 1)) at time zone p_tz;

  return query
  with pv as (
    select * from public.page_views p
    where p.created_at >= v_since and (p_include_test or not p.is_test)
  ), items as (
    select d.dimension, d.label
    from pv
    cross join lateral (values
      ('country', coalesce(pv.country, 'Unknown')),
      ('device', coalesce(pv.device, 'Unknown')),
      ('source', coalesce(pv.referrer, 'Direct'))
    ) as d (dimension, label)
    where pv.kind = 'pageview'
    union all
    select 'section', pv.view from pv where pv.kind = 'open' or pv.view <> 'home'
  ), counted as (
    select i.dimension, i.label, count(*) as total,
           row_number() over (partition by i.dimension order by count(*) desc, i.label) as position
    from items i
    group by i.dimension, i.label
  )
  select c.dimension, c.label, c.total from counted c where c.position <= 8
  order by c.dimension, c.total desc;
end;
$$;

revoke all on function public.is_admin() from public, anon;
revoke all on function public.admin_traffic(text, int, text, boolean) from public, anon;
revoke all on function public.admin_breakdown(text, int, text, boolean) from public, anon;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.admin_traffic(text, int, text, boolean) to authenticated;
grant execute on function public.admin_breakdown(text, int, text, boolean) to authenticated;
