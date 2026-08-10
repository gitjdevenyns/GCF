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
export async function fetchConditions(slug: string): Promise<ConditionsSnapshot> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured for this build');
  }
  return await readConditions(slug);
}
