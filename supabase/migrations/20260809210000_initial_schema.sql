-- GCF initial schema: content tables, provenance, external-data snapshot caches, RLS.
-- Public read-only app: anon gets SELECT on everything; all writes happen via the
-- service role (Edge Functions / migrations), which bypasses RLS. No user auth in scope.

create extension if not exists moddatetime schema extensions;

-- ---------------------------------------------------------------------------
-- Tide stations (NOAA CO-OPS). Referenced by locations and tide_snapshots.
-- station_type: 'reference' (harmonic) or 'subordinate' (offsets from a
-- reference station; CO-OPS API serves high/low predictions for these).
-- ---------------------------------------------------------------------------
create table public.tide_stations (
  id text primary key,                 -- NOAA CO-OPS station id, e.g. '8726247'
  name text not null,
  lat double precision,
  lng double precision,
  station_type text check (station_type in ('reference', 'subordinate')),
  reference_station_id text,           -- for subordinate stations
  url text,
  notes text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------
create table public.fish (
  id text primary key,                 -- slug, e.g. 'snook'
  name text not null,
  images text[] not null default '{}',
  habitat text,
  gear text,
  leader text,
  hook text,
  bait text,
  handling_dos text[] not null default '{}',
  handling_donts text[] not null default '{}',
  angler_safety text,
  updated_at timestamptz not null default now()
);

create table public.hazards (
  id text primary key,                 -- slug, e.g. 'stingray'
  name text not null,
  image text,
  risk text,
  handle text,
  risk_short text,                     -- condensed card text (from DANGER list)
  handle_short text,
  injury_media jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.habitats (
  id text primary key,                 -- slug, e.g. 'oyster-bar'
  name text not null,
  diagram text,                        -- local asset path
  photos text[] not null default '{}',
  look text,                           -- how to identify it
  fish_summary text,                   -- which fish use it
  how_to_fish text,
  updated_at timestamptz not null default now()
);

create table public.rigs (
  id text primary key,                 -- slug, e.g. 'fg-knot'
  name text not null,
  category text check (category in ('knot', 'rig')),
  url text,                            -- tutorial link
  updated_at timestamptz not null default now()
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  region text,
  lat double precision not null,
  lng double precision not null,
  access text,
  structures text[] not null default '{}',
  tide_station_id text references public.tide_stations(id),
  seasons text[] not null default '{}',
  dayparts text[] not null default '{}',
  tide_playbook jsonb not null default '{}'::jsonb,
  safety text[] not null default '{}',
  access_notes text[] not null default '{}',
  updated_at timestamptz not null default now()
);
create index locations_tide_station_idx on public.locations (tide_station_id);

-- Per-species tackle recipe rows for each location.
create table public.location_targets (
  id bigint generated always as identity primary key,
  location_id uuid not null references public.locations(id) on delete cascade,
  fish_id text references public.fish(id),   -- null when species has no fish page yet
  species_label text not null,               -- display label, e.g. 'Sheepshead'
  priority int not null default 1,           -- 1 = primary target at this spot
  rig text,
  hook text,
  leader text,
  main_line text,
  weight text,
  baits text[] not null default '{}',
  lures text[] not null default '{}',
  presentation text,
  cast_zone text,
  landing_tool text,
  release_notes text,
  updated_at timestamptz not null default now(),
  unique (location_id, species_label)
);
create index location_targets_location_idx on public.location_targets (location_id, priority);

-- ---------------------------------------------------------------------------
-- Provenance
-- ---------------------------------------------------------------------------
create table public.sources (
  id bigint generated always as identity primary key,
  url text not null unique,
  title text,
  publisher text,
  license text,                        -- e.g. 'US Government public domain', 'unverified'
  retrieved_at date,
  subject text,
  notes text,
  updated_at timestamptz not null default now()
);

-- Generic join from a source to any content row (content_id is the row's pk as text).
create table public.source_links (
  id bigint generated always as identity primary key,
  source_id bigint not null references public.sources(id) on delete cascade,
  content_table text not null,         -- e.g. 'fish', 'locations', 'tide_stations'
  content_id text not null,
  unique (source_id, content_table, content_id)
);
create index source_links_content_idx on public.source_links (content_table, content_id);

-- ---------------------------------------------------------------------------
-- External-data snapshot caches (append-only; latest-per-key via views below,
-- backed by the (key, refreshed_at desc) indexes).
-- ---------------------------------------------------------------------------
create table public.weather_snapshots (
  id bigint generated always as identity primary key,
  location_slug text not null,         -- matches locations.slug
  kind text not null default 'forecast' check (kind in ('forecast', 'hourly', 'points')),
  payload jsonb not null,
  source_url text,
  refreshed_at timestamptz not null default now()
);
create index weather_snapshots_latest_idx
  on public.weather_snapshots (location_slug, kind, refreshed_at desc);

create table public.tide_snapshots (
  id bigint generated always as identity primary key,
  station_id text not null references public.tide_stations(id),
  payload jsonb not null,              -- CO-OPS predictions response (hilo)
  source_url text,
  refreshed_at timestamptz not null default now()
);
create index tide_snapshots_latest_idx
  on public.tide_snapshots (station_id, refreshed_at desc);

create table public.fishing_report_snapshots (
  id bigint generated always as identity primary key,
  region text not null,                -- e.g. 'Bradenton', 'Boca Grande'
  payload jsonb not null,
  source_url text,
  refreshed_at timestamptz not null default now()
);
create index fishing_report_snapshots_latest_idx
  on public.fishing_report_snapshots (region, refreshed_at desc);

-- Latest-per-key views (security_invoker so anon RLS applies to base tables).
create view public.weather_latest
  with (security_invoker = on) as
  select distinct on (location_slug, kind) *
  from public.weather_snapshots
  order by location_slug, kind, refreshed_at desc;

create view public.tide_latest
  with (security_invoker = on) as
  select distinct on (station_id) *
  from public.tide_snapshots
  order by station_id, refreshed_at desc;

create view public.fishing_report_latest
  with (security_invoker = on) as
  select distinct on (region) *
  from public.fishing_report_snapshots
  order by region, refreshed_at desc;

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create trigger set_updated_at before update on public.tide_stations
  for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.fish
  for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.hazards
  for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.habitats
  for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.rigs
  for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.locations
  for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.location_targets
  for each row execute function extensions.moddatetime(updated_at);
create trigger set_updated_at before update on public.sources
  for each row execute function extensions.moddatetime(updated_at);

-- ---------------------------------------------------------------------------
-- RLS: enable everywhere; anon/authenticated may SELECT only.
-- No insert/update/delete policies exist, so client writes are denied.
-- The service role bypasses RLS (Edge Functions / server-side only).
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'tide_stations', 'fish', 'hazards', 'habitats', 'rigs',
    'locations', 'location_targets', 'sources', 'source_links',
    'weather_snapshots', 'tide_snapshots', 'fishing_report_snapshots'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
    -- Belt-and-suspenders: strip write grants from client roles.
    execute format('revoke insert, update, delete on public.%I from anon, authenticated', t);
  end loop;
end
$$;
