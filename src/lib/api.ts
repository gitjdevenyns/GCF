/**
 * Data-access layer.
 *
 * Static guide content is served from the bundled typed modules in src/data
 * (works fully offline). Dynamic per-location conditions (cached weather/tide
 * snapshots) will come from Supabase later; getConditions() is the seam where
 * that slots in — it currently always resolves to null.
 */
import {
  FISH,
  HABITATS,
  HAZARDS,
  LOCATIONS,
  RIGS,
  TIDE_GUIDE,
  VIDEOS,
  fishById,
  locationBySlug,
} from '../data';
import type { Fish, Habitat, Hazard, Location, Rig, TideGuide, VideoLink } from '../data';
import { isSupabaseConfigured, readConditions } from './supabase';
import type { ConditionsSnapshot } from './conditions';

export const getLocations = (): Location[] => LOCATIONS;
export const getLocation = (slug: string): Location | undefined =>
  locationBySlug(slug);
export const getFishList = (): Fish[] => FISH;
export const getFish = (id: string): Fish | undefined => fishById(id);
export const getHabitats = (): Habitat[] => HABITATS;
export const getHazards = (): Hazard[] => HAZARDS;
export const getRigs = (): Rig[] => RIGS;
export const getVideos = (): VideoLink[] => VIDEOS;
export const getTideGuide = (): TideGuide => TIDE_GUIDE;

/**
 * Cached weather/tide snapshot for one location slug, read from the Supabase
 * `tide_latest` / `weather_latest` views (anon, read-only).
 *
 * Rejects on transport/query failure — useConditions() owns the error surface.
 * Never call this directly from a component; use useConditions().
 */
/**
 * In-flight and recently-settled reads, keyed by slug.
 *
 * Home asks for conditions three times — the seed station, the recommended
 * spot, and the nearest spot once location is granted — and those frequently
 * resolve to the same slug, which was firing four identical request pairs per
 * load. The snapshot behind them is rewritten every three hours, so a short
 * window of sharing costs nothing in freshness and removes the duplicates.
 *
 * Failures are evicted immediately: a retry button that returns a cached
 * rejection is not a retry button.
 */
const inflight = new Map<string, { at: number; p: Promise<ConditionsSnapshot> }>();
const CONDITIONS_TTL_MS = 60_000;

export async function fetchConditions(slug: string): Promise<ConditionsSnapshot> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured for this build');
  }
  const hit = inflight.get(slug);
  if (hit && Date.now() - hit.at < CONDITIONS_TTL_MS) return hit.p;

  const p = readConditions(slug).catch((e: unknown) => {
    inflight.delete(slug);
    throw e;
  });
  inflight.set(slug, { at: Date.now(), p });
  return p;
}

/** Drops the cache so a retry actually re-reads. Used by useConditions.refetch. */
export function clearConditionsCache(slug?: string): void {
  if (slug) inflight.delete(slug);
  else inflight.clear();
}
