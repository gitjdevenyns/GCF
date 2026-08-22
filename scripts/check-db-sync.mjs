/**
 * Fails if the Supabase `locations` table disagrees with the bundled guide.
 *
 * That table is load-bearing for live data in two places that both fail
 * quietly: `refresh-conditions` polls exactly the stations it names, and
 * `readConditions()` returns an empty snapshot for any slug missing from it.
 * A spot added to `src/data/locations.ts` and not to the table therefore has
 * no live tide and no forecast, with no error anywhere — the card just reads
 * "updated unknown", which looks like a stale cache rather than a missing row.
 *
 * That is precisely how ten of twenty-five spots ended up with no live data.
 *
 * Network, so it lives outside `npm test` alongside `check:links`.
 *   npm run check:db-sync
 */
import { LOCATIONS } from '../src/data/locations.ts';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (e.g. `set -a && . ./.env.local`).');
  process.exit(2);
}

const get = async (path) => {
  const r = await fetch(`${url}/rest/v1/${path}`, { headers: { apikey: key } });
  if (!r.ok) throw new Error(`${path}: ${r.status} ${await r.text()}`);
  return r.json();
};

const rows = await get('locations?select=slug,tide_station_id');
const tides = await get('tide_latest?select=station_id');

const dbSlugs = new Set(rows.map((r) => r.slug));
const dbStations = new Set(rows.map((r) => r.tide_station_id).filter(Boolean));
const withTide = new Set(tides.map((t) => t.station_id));

const missingSlugs = LOCATIONS.filter((l) => !dbSlugs.has(l.slug)).map((l) => l.slug);
const wantStations = new Set(LOCATIONS.map((l) => l.tide_station?.noaa_id).filter(Boolean));
const missingStations = [...wantStations].filter((s) => !dbStations.has(s));
const unpolled = [...wantStations].filter((s) => !withTide.has(s));
const orphanSlugs = [...dbSlugs].filter((s) => !LOCATIONS.some((l) => l.slug === s));

const line = (label, list) =>
  console.log(`${list.length === 0 ? 'ok  ' : 'FAIL'}  ${label}: ${list.length}${list.length ? ' -> ' + list.join(', ') : ''}`);

console.log(`bundled ${LOCATIONS.length} locations / ${wantStations.size} stations · db ${dbSlugs.size} / ${dbStations.size} · tide_latest ${withTide.size}\n`);
line('locations missing from db (no live data at all)', missingSlugs);
line('stations missing from db (never polled)', missingStations);
line('stations with no tide_latest row yet', unpolled);
line('db rows with no bundled location', orphanSlugs);

const broken = missingSlugs.length + missingStations.length;
if (broken) {
  console.log('\nFix: apply the newest supabase/migrations/*_sync_locations.sql');
  console.log('Regenerate it with: npx vite-node scripts/gen-location-seed.mjs > supabase/migrations/<ts>_sync_locations.sql');
}
process.exit(broken ? 1 : 0);
