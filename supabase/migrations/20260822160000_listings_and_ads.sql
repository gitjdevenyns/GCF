-- Two separate paid products, deliberately not sharing a table.
--
-- `shop_listings` attaches to a business already in the researched directory
-- bundled at src/data/shops.ts. It controls whether that shop is shown at all
-- (an editorial call) and whether it is enhanced (a commercial one). It cannot
-- add a shop, hide a competitor, or change a researched fact.
--
-- `ad_campaigns` is open advertising from anyone, with no editorial claim
-- behind it and no connection to the directory.
--
-- Merging the two would be the mistake that eventually destroys the directory:
-- once "is this shop listed" and "is this shop paying" live in one row, the
-- pressure to make presence follow payment becomes structural.

-- Supersedes the never-shipped `sponsorships` table, which conflated them.
drop table if exists public.sponsorships cascade;

create table if not exists public.shop_listings (
  -- Slug of a shop in src/data/shops.ts. Not a foreign key: the directory is
  -- bundled in the client, not mirrored here. Unknown slugs are dropped by the
  -- parser, and src/test/listings.test.ts guards the app side.
  shop_slug    text primary key,
  -- Editorial: does this shop appear to readers at all? Independent of tier —
  -- an unpaid shop is still included, and a researched-but-unconfirmed shop
  -- can be excluded until someone has made the call.
  included     boolean     not null default false,
  tier         text        not null default 'basic' check (tier in ('basic','enhanced')),
  starts_at    timestamptz,
  ends_at      timestamptz,
  -- The advertiser's own material: logo, photos, owner statement, offer.
  -- Shape mirrors EnhancedContent in src/lib/listings.ts.
  enhanced     jsonb       not null default '{}'::jsonb,
  -- Which extras the deal buys. Shape mirrors ListingPlacements.
  placements   jsonb       not null default '{}'::jsonb,
  -- Private: rate, contact, renewal date. Never exposed to anon.
  admin_notes  text,
  updated_at   timestamptz not null default now(),
  constraint shop_listings_window_valid check (ends_at is null or ends_at > starts_at)
);

create table if not exists public.ad_campaigns (
  id           uuid primary key default gen_random_uuid(),
  -- Never nullable. An ad with no named advertiser cannot be disclosed
  -- honestly, and the client refuses to render one.
  advertiser   text        not null,
  headline     text        not null,
  body         text,
  image_url    text,
  href         text,
  -- Named slots from AD_SLOTS in src/lib/listings.ts.
  slots        text[]      not null default '{}',
  starts_at    timestamptz not null default now(),
  ends_at      timestamptz,
  active       boolean     not null default false,
  admin_notes  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint ad_campaigns_window_valid check (ends_at is null or ends_at > starts_at)
);

create index if not exists ad_campaigns_active_idx on public.ad_campaigns (active, starts_at, ends_at);

alter table public.shop_listings enable row level security;
alter table public.ad_campaigns  enable row level security;

-- Readers see only what is currently live. The date window is enforced in the
-- policy, not just a view, so a lapsed deal needs no deploy and no cron to
-- stop showing — the row simply becomes invisible.
drop policy if exists "public read live listings" on public.shop_listings;
create policy "public read live listings"
  on public.shop_listings for select to anon, authenticated
  using (
    included
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at > now())
  );

drop policy if exists "public read live ads" on public.ad_campaigns;
create policy "public read live ads"
  on public.ad_campaigns for select to anon, authenticated
  using (active and starts_at <= now() and (ends_at is null or ends_at > now()));

-- Admins manage both, and can see rows outside their window — otherwise you
-- could not schedule a deal or review one that has ended.
drop policy if exists "admin all listings" on public.shop_listings;
create policy "admin all listings" on public.shop_listings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin all ads" on public.ad_campaigns;
create policy "admin all ads" on public.ad_campaigns for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

revoke insert, update, delete on public.shop_listings from anon, authenticated;
revoke insert, update, delete on public.ad_campaigns  from anon, authenticated;

-- Read surfaces that exclude admin_notes. security_invoker keeps the policies
-- above in force; the column list is what stops rates and contacts leaking.
create or replace view public.shop_listing_public with (security_invoker = on) as
  select shop_slug, included, tier, starts_at, ends_at, enhanced, placements
  from public.shop_listings;

create or replace view public.ad_campaign_public with (security_invoker = on) as
  select id, advertiser, headline, body, image_url, href, slots, starts_at, ends_at, active
  from public.ad_campaigns;

grant select on public.shop_listing_public to anon, authenticated;
grant select on public.ad_campaign_public  to anon, authenticated;

create trigger set_updated_at before update on public.shop_listings
  for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.ad_campaigns
  for each row execute function extensions.moddatetime(updated_at);
