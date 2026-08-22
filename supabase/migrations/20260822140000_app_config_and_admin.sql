-- Owner-configurable app settings: the free/paid capability matrix and ad slots.
--
-- Why a table rather than a constant in the bundle: packaging changes far more
-- often than code. Moving a spot from paid to free, capping photo IDs, or
-- pulling an ad slot should take ten seconds in an admin screen, not a deploy.
-- The client keeps a shipped default matrix (src/lib/entitlements.ts) and
-- merges whatever it reads on top, so the app is fully correct offline and
-- fully correct if this table is empty.

create table if not exists public.app_config (
  key         text primary key,
  value       jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  uuid
);

-- Who may change packaging and advertising. Membership is granted by the
-- service role only — deliberately not self-serve, and not something the app
-- can grant itself.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

alter table public.app_config enable row level security;
alter table public.admins     enable row level security;

-- Config is public to READ: the client needs the matrix before anyone signs
-- in, and it holds no secrets — it describes what free and paid include, which
-- is marketing copy, not sensitive data.
drop policy if exists "public read config" on public.app_config;
create policy "public read config"
  on public.app_config for select to anon, authenticated using (true);

-- Writes require an admin row. An ordinary signed-in user cannot hand
-- themselves the paid tier by writing here.
drop policy if exists "admin write config" on public.app_config;
create policy "admin write config"
  on public.app_config for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- The admin list is readable only by admins, so the app cannot enumerate who
-- can edit it.
drop policy if exists "admins read self" on public.admins;
create policy "admins read self"
  on public.admins for select to authenticated using (public.is_admin());

revoke insert, update, delete on public.app_config from anon;
revoke all on public.admins from anon;

-- Sponsorships already exist (20260822120000). Admins get write access to them
-- through the same gate, so paid placement is configured in the same screen.
drop policy if exists "admin write sponsorships" on public.sponsorships;
create policy "admin write sponsorships"
  on public.sponsorships for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Admins may also read sponsorships outside their date window, which the
-- public policy forbids — otherwise you could not schedule a deal in advance
-- or review one that has ended.
drop policy if exists "admin read all sponsorships" on public.sponsorships;
create policy "admin read all sponsorships"
  on public.sponsorships for select to authenticated using (public.is_admin());

create trigger set_updated_at before update on public.app_config
  for each row execute function extensions.moddatetime(updated_at);

-- Seed the two config rows so the admin screen has something to load.
insert into public.app_config (key, value) values
  ('entitlements', '{}'::jsonb),
  ('ads',          '{"slots": []}'::jsonb)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- To grant yourself admin (service role / SQL editor, once you have signed in):
--
--   insert into public.admins (user_id, email)
--   select id, email from auth.users where email = 'you@example.com'
--   on conflict (user_id) do nothing;
-- ---------------------------------------------------------------------------
