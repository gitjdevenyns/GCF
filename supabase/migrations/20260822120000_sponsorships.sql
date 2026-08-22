-- Paid placement for shops in the guide's editorial directory.
--
-- The editorial directory itself is bundled in the app (src/data/shops.ts) and
-- is not represented here: this table only records who is paying for what, and
-- until when. It can grant prominence. It cannot add a shop, hide a shop, or
-- change a researched fact.
--
-- The date window is enforced in the RLS policy rather than only in a view, so
-- an anonymous client physically cannot read a deal that has not started or has
-- already ended. Expiry therefore needs no deploy and no cron: the row simply
-- stops being visible. Owner-side reads and edits go through the service role.

create table if not exists public.sponsorships (
  id            uuid primary key default gen_random_uuid(),
  -- Slug of a shop in src/data/shops.ts. Intentionally not a foreign key:
  -- the directory is bundled in the client, not mirrored in Postgres. The
  -- client drops any row whose slug it does not recognise, and
  -- src/test/shops.data.test.ts guards the app side of that contract.
  shop_slug     text        not null,
  -- The owner's own name for the deal ("Local Partner", "Season 2026").
  -- Display-only; it grants nothing on its own.
  label         text,
  starts_at     timestamptz not null default now(),
  -- Null means "until cancelled". Set it and the row disappears on that date.
  ends_at       timestamptz,
  logo_url      text,
  -- Advertiser-supplied copy. Shown as the advertiser's words, never the guide's.
  offer_text    text,
  -- Independent capability switches, not a tier enum, so a deal can be shaped
  -- per shop without a schema or code change. Shape mirrors SponsorPlacements
  -- in src/lib/sponsorship.ts; unknown keys are ignored by the parser, and a
  -- malformed value collapses to no placements at all.
  placements    jsonb       not null default '{}'::jsonb,
  -- Private billing/admin notes. Never exposed to anon; see the view below.
  admin_notes   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint sponsorships_window_valid check (ends_at is null or ends_at > starts_at)
);

create index if not exists sponsorships_shop_slug_idx on public.sponsorships (shop_slug);
create index if not exists sponsorships_window_idx on public.sponsorships (starts_at, ends_at);

alter table public.sponsorships enable row level security;

-- Anon and authenticated may read ONLY currently-running deals. A future or
-- expired row is invisible, not merely unrendered.
drop policy if exists "public read active" on public.sponsorships;
create policy "public read active"
  on public.sponsorships
  for select
  to anon, authenticated
  using (
    starts_at <= now()
    and (ends_at is null or ends_at > now())
  );

-- Belt-and-suspenders: no client role writes advertising.
revoke insert, update, delete on public.sponsorships from anon, authenticated;

-- Read surface for the app. security_invoker keeps the policy above in force,
-- and the column list is what stops admin_notes from ever reaching a client.
create or replace view public.sponsorship_active
  with (security_invoker = on) as
  select
    shop_slug,
    label,
    starts_at,
    ends_at,
    logo_url,
    offer_text,
    placements
  from public.sponsorships;

grant select on public.sponsorship_active to anon, authenticated;
