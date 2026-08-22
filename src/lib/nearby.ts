import type { Location, TideStage } from '../data';
import { milesBetween } from './geo';

/**
 * Ranks the guide's spots against where someone is standing, right now.
 *
 * Every input is either arithmetic (distance) or a field somebody researched
 * (prime tide stages, dayparts, seasons, access). Nothing here is inferred,
 * predicted, or learned, and that shapes what the output is allowed to say.
 *
 * WHAT THIS IS NOT. It does not estimate whether you will catch a fish. There
 * is no catch data in this app to calibrate such a claim against, so a
 * likelihood number would be unfalsifiable — and this guide already refuses
 * that move in the photo identifier, where no number on screen implies a
 * calibrated probability. The same rule applies here.
 *
 * WHAT IT IS. A transparent match: near you, on the tide it is researched to
 * fish, at an hour it is researched to fish, in a month it is researched to
 * fish. Every `reason` string is either a measured fact or a quotation of
 * researched content, so the "why" can always be traced to something real.
 * That is the honest and — going by the app-store landscape, where every
 * competitor hands you a black-box score — the more interesting claim.
 *
 * A field nobody has researched yet contributes nothing and says nothing.
 * `seasons` exists for 10 of 25 spots and `dayparts` for 13, so silence about
 * a spot's season means the guide has not done that work, never that the
 * season is bad. Reasons must never let those two read the same.
 */

/**
 * One distance, formatted one way, used by every caller.
 *
 * "Right here" has to mean it: at a tenth of a mile you can see the water from
 * where you are standing. The threshold used to be wide enough that two
 * different spots half a mile apart both claimed it, which reads as broken.
 */
export function formatMiles(miles: number): string {
  if (miles < 0.1) return 'right here';
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

export interface NearbySpot {
  location: Location;
  miles: number;
  score: number;
  /** Human-readable, ordered strongest first. Safe to render verbatim. */
  reasons: string[];
  /** True only when a real tide reading backed the tide reason. */
  tideMatched: boolean;
}

/**
 * Rough daypart from the local hour.
 *
 * Deliberately coarse. True dawn and dusk move by about an hour across the
 * year at this latitude, and computing them properly would be a solar
 * position calculation for a label that only ever nudges a ranking. The
 * windows are wide enough to be defensible and the copy never states a
 * sunrise time, so the approximation cannot be mistaken for a claim.
 */
export type Daypart = 'dawn' | 'day' | 'dusk' | 'night';

export function daypartAt(hour: number): Daypart {
  if (hour >= 5 && hour < 9) return 'dawn';
  if (hour >= 9 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'dusk';
  return 'night';
}

const MONTHS = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

/**
 * Does a researched season note cover `month` (0-indexed)?
 *
 * The notes are prose that mostly opens with a range — "Dec–Mar sheepshead on
 * the pier and bars", "Apr–Oct snook along the mangrove edges". Only that
 * leading range is read; a note without one ("Trout on the grass most of the
 * year") makes no month claim, so it is not treated as one either way.
 * Ranges wrap across the new year.
 */
export function seasonCoversMonth(note: string, month: number): boolean {
  const m = /^\s*([A-Za-z]{3})[a-z]*\s*[–—-]\s*([A-Za-z]{3})[a-z]*/.exec(note);
  if (!m) return false;
  const from = MONTHS.indexOf(m[1].toLowerCase());
  const to = MONTHS.indexOf(m[2].toLowerCase());
  if (from < 0 || to < 0) return false;
  return from <= to ? month >= from && month <= to : month >= from || month <= to;
}

/**
 * Scoring weights.
 *
 * Distance dominates on purpose: a perfect tide forty miles away is not a
 * suggestion, it is a road trip. The rest are nudges that reorder spots
 * already within reach of each other, and each one is worth roughly a mile
 * or two of driving — which is about how a person actually trades them off.
 */
const W = {
  /** Score decays over this distance; past it, spots are effectively tied. */
  distanceHalfLife: 8,
  tide: 26,
  daypart: 12,
  season: 10,
  /** The guide's audience is mostly on foot. */
  landAccess: 6,
};

const LAND = ['shore', 'wade', 'pier', 'bridge'];

export interface RankOptions {
  /**
   * Current tide stage, when one is actually known. Null means no reading —
   * the ranking then simply omits every tide term rather than guessing.
   */
  stage: TideStage | null;
  /** Station the stage came from, for attribution in the reason text. */
  stationName?: string | null;
  now?: Date;
  /** Spots beyond this are dropped entirely. */
  maxMiles?: number;
  limit?: number;
}

export function rankNearby(
  locations: Location[],
  coords: { lat: number; lng: number },
  { stage, stationName = null, now = new Date(), maxMiles = 30, limit = 3 }: RankOptions,
): NearbySpot[] {
  const month = now.getMonth();
  const part = daypartAt(now.getHours());

  const scored: NearbySpot[] = [];

  for (const location of locations) {
    const miles = milesBetween(coords, location);
    if (miles > maxMiles) continue;

    const reasons: string[] = [];
    let score = W.distanceHalfLife / (W.distanceHalfLife + miles) * 100;

    reasons.push(
      miles < 0.1 ? 'You are standing on it' : `${formatMiles(miles)} away`,
    );

    const tideMatched = stage !== null && location.tide_playbook.prime_stages.includes(stage);
    if (tideMatched) {
      score += W.tide;
      reasons.push(
        stationName
          ? `Fishes best on this stage, and that is the stage running now at ${stationName}`
          : 'Fishes best on the stage running now',
      );
    }

    if (location.dayparts.includes(part)) {
      score += W.daypart;
      reasons.push(`Researched as a ${part} spot, and it is ${part} now`);
    }

    // Quoted verbatim: this is researched fishing content, and paraphrasing it
    // would be writing new fishing content, which the guide does not do.
    const inSeason = location.seasons.find((s) => seasonCoversMonth(s, month));
    if (inSeason) {
      score += W.season;
      reasons.push(`In season now — "${inSeason}"`);
    }

    const land = location.access.filter((a) => LAND.includes(a));
    if (land.length > 0) {
      score += W.landAccess;
      reasons.push(`${land.join(' and ')} access — no boat needed`);
    }

    scored.push({ location, miles, score, reasons, tideMatched });
  }

  // Distance breaks ties, so two equally-matched spots order the way a person
  // would expect rather than by however the data happened to be written.
  scored.sort((a, b) => b.score - a.score || a.miles - b.miles);
  return scored.slice(0, limit);
}
