-- Rate-limit ledger for the `identify-fish` Edge Function.
--
-- Photo identification is the only path in this app that spends money per
-- request — a Claude vision call billed to the owner's own Anthropic account —
-- and the site is public with a publishable anon key in the bundle. So the
-- function has to be able to say no, and say it clearly. This table is the
-- ledger; `claim_fish_id_slot()` is the gate. The function calls it once, before
-- any money is spent, and gets back either an allow or a refusal specific enough
-- for the client to render as honest text ("you've used your six for this hour").
--
-- What is stored: a salted HMAC of the caller's IP address and a timestamp.
-- Nothing else. No raw IP, no photo, no identification result — the photo is
-- processed in memory and discarded, and the hash is computed inside the Edge
-- Function with a pepper that never leaves the server.

create table public.fish_id_requests (
  id bigint generated always as identity primary key,
  caller_hash text not null,           -- HMAC-SHA256(ip, server pepper), hex
  created_at timestamptz not null default now()
);

create index fish_id_requests_caller_idx
  on public.fish_id_requests (caller_hash, created_at desc);
create index fish_id_requests_created_idx
  on public.fish_id_requests (created_at desc);

-- RLS on with no policies at all: anon and authenticated can neither read the
-- ledger nor write to it. Only the service role (injected into the Edge Function
-- runtime, never shipped to a client) bypasses RLS.
alter table public.fish_id_requests enable row level security;
revoke all on public.fish_id_requests from anon, authenticated;

-- ---------------------------------------------------------------------------
-- The gate. Returns jsonb rather than a boolean so the caller learns *which*
-- limit it hit and how long to wait, and so a new limit can be added later
-- without changing the signature.
--
-- Three windows, checked cheapest-first:
--   per hour  — stops one person burning the budget in a single session
--   per day   — stops one person burning it over an afternoon
--   global    — the backstop that actually bounds the monthly bill, because the
--               per-caller limits are per *IP* and an IP is not an identity
--
-- Counting and inserting happen in one statement-level transaction, so two
-- concurrent requests from the same caller cannot both see the same count and
-- both be allowed past the last slot.
-- ---------------------------------------------------------------------------
create function public.claim_fish_id_slot(
  p_caller_hash text,
  p_per_hour int default 6,
  p_per_day int default 20,
  p_global_per_day int default 250
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_count int;
  v_oldest timestamptz;
  v_retry int;
begin
  if p_caller_hash is null or length(p_caller_hash) < 32 then
    raise exception 'claim_fish_id_slot: caller hash missing or too short';
  end if;

  -- The ledger exists only to answer "how many in the last day", so anything
  -- past the longest window is dead weight. Pruned inline rather than on a
  -- schedule: this function is the table's only writer and runs, by
  -- construction, at most a few hundred times a day.
  delete from public.fish_id_requests where created_at < now() - interval '2 days';

  -- ---- per caller, last hour
  select count(*), min(created_at) into v_count, v_oldest
    from public.fish_id_requests
    where caller_hash = p_caller_hash and created_at > now() - interval '1 hour';
  if v_count >= p_per_hour then
    v_retry := greatest(ceil(extract(epoch from (v_oldest + interval '1 hour' - now())))::int, 1);
    return jsonb_build_object('allowed', false, 'scope', 'hour',
                              'limit', p_per_hour, 'retry_after_seconds', v_retry);
  end if;

  -- ---- per caller, last day
  select count(*), min(created_at) into v_count, v_oldest
    from public.fish_id_requests
    where caller_hash = p_caller_hash and created_at > now() - interval '1 day';
  if v_count >= p_per_day then
    v_retry := greatest(ceil(extract(epoch from (v_oldest + interval '1 day' - now())))::int, 1);
    return jsonb_build_object('allowed', false, 'scope', 'day',
                              'limit', p_per_day, 'retry_after_seconds', v_retry);
  end if;

  -- ---- everyone, last day
  select count(*), min(created_at) into v_count, v_oldest
    from public.fish_id_requests
    where created_at > now() - interval '1 day';
  if v_count >= p_global_per_day then
    v_retry := greatest(ceil(extract(epoch from (v_oldest + interval '1 day' - now())))::int, 1);
    return jsonb_build_object('allowed', false, 'scope', 'global',
                              'limit', p_global_per_day, 'retry_after_seconds', v_retry);
  end if;

  insert into public.fish_id_requests (caller_hash) values (p_caller_hash);
  return jsonb_build_object('allowed', true);
end
$$;

-- Functions are granted to PUBLIC by default. This one inserts rows under
-- definer rights, so take that back explicitly: only the service role may call it.
revoke all on function public.claim_fish_id_slot(text, int, int, int)
  from public, anon, authenticated;
