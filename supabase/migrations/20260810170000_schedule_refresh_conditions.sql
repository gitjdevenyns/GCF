-- Schedule the `refresh-conditions` Edge Function every 3 hours.
--
-- Cadence rationale: NOAA regenerates tide predictions rarely and NWS issues
-- forecasts a few times a day, so 3-hourly is fresh enough for a fishing
-- planner while staying trivially polite to both APIs (9 CO-OPS calls + ~12
-- NWS gridpoint calls per run). The client treats a snapshot older than 6 h as
-- stale, so a 3 h cadence leaves one whole run of slack before anything is
-- presented as out of date.
--
-- The bearer token is read from Vault at *run* time, never inlined here, so no
-- key material lives in the repository. Create it once per project with:
--
--   select vault.create_secret('<VITE_SUPABASE_ANON_KEY>', 'gcf_functions_bearer');
--
-- The anon key is sufficient: the function has verify_jwt = true (so the
-- endpoint is not open to the world) and does its database writes with the
-- service-role key that Supabase injects into the Edge runtime. The service
-- role key is never used as the scheduled caller's bearer.

create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

-- cron.schedule upserts on (jobname, username), so re-running this migration
-- against a project that already has the job is a no-op rather than a
-- duplicate.
select cron.schedule(
  'refresh-conditions-every-3h',
  '5 */3 * * *',   -- 5 minutes past every 3rd hour, UTC
  $job$
  select net.http_post(
    url := 'https://nwpuausjhqtvwmjprphc.supabase.co/functions/v1/refresh-conditions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization',
      'Bearer ' || (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'gcf_functions_bearer'
      )
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  );
  $job$
);
