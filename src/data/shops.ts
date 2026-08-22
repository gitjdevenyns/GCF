import type { Region, SourceRef } from './types';

/**
 * Tackle, bait and access businesses near the guide's spots.
 *
 * This module is EDITORIAL and bundled, exactly like locations and species: it
 * ships in the app, works offline, and is researched, not sold. Whether a shop
 * pays for anything lives in a completely separate layer
 * (`src/lib/sponsorship.ts`, backed by Supabase and bounded by dates).
 *
 * The separation is the point, and it is worth stating plainly because the
 * temptation to collapse it will keep coming back:
 *
 *  - A directory that only lists shops who paid is not a directory. It has no
 *    readers, so there is nothing to sell — and the first angler who notices
 *    the shop across the street is missing stops trusting the whole guide,
 *    which is the only asset here that is actually hard to rebuild.
 *  - A researched directory that paying shops can stand out *within* has
 *    readers on day one, ranks for the "bait shop near <place>" searches the
 *    keyword work turned up, and gives a paying shop something worth paying
 *    for: prominence among people already looking.
 *
 * So: every real shop belongs here, paid or not. Payment buys placement, never
 * presence, and never removal of a competitor.
 *
 * CONTENT RULE — the same one the rest of the guide runs on, and stricter here.
 * Nothing in this file may be written from general knowledge. These are real
 * businesses: a plausible-but-wrong address, phone number or set of opening
 * hours sends someone across the county to a closed door, and an invented shop
 * name is worse. Every entry needs a checkable source in `sources`, and any
 * field that has not been verified stays empty rather than guessed.
 */

/** What the business actually is. A shop can be more than one. */
export type ShopKind = 'tackle' | 'bait' | 'marina' | 'ramp' | 'charter';

export interface Shop {
  id: string;
  slug: string;
  name: string;
  kind: ShopKind[];
  region: Region;
  lat: number;
  lng: number;
  /** Street address as published by the business. */
  address: string;
  phone: string | null;
  website: string | null;
  /** Verified stock/services, e.g. "live shrimp", "frozen bait". Empty until researched. */
  carries: string[];
  /** Opening hours as published. Null until verified — a wrong one is worse than none. */
  hours: string | null;
  /**
   * Slugs from `locations.ts` this shop is a practical stop for.
   *
   * This is the spine of the whole feature: it is how a location page finds
   * its nearest bait, how a sponsored pin lands somewhere relevant instead of
   * scattered across the map, and how the directory answers "where do I get
   * shrimp before I fish Fort De Soto". `src/test/shops.data.test.ts` fails
   * the build if any slug here does not exist.
   */
  serves: string[];
  /** Researched notes. Never sales copy — sponsor copy lives in the sponsorship layer. */
  notes: string[];
  sources: SourceRef[];
}

/**
 * The directory.
 *
 * Deliberately empty. Populating it means visiting or verifying each business
 * against a checkable source, and this is the one file in the guide where
 * inventing an entry does direct harm to a third party — a real shop with a
 * wrong phone number, or a competitor omitted. It is a research task, not a
 * writing task.
 *
 * Every screen that reads this renders correctly against an empty list.
 */
export const SHOPS: Shop[] = [];

export const shopBySlug = (slug: string): Shop | undefined =>
  SHOPS.find((s) => s.slug === slug);

/** Shops that name `locationSlug` in `serves`, in editorial order. */
export const shopsServing = (locationSlug: string): Shop[] =>
  SHOPS.filter((s) => s.serves.includes(locationSlug));

export const SHOP_KINDS: ShopKind[] = ['tackle', 'bait', 'marina', 'ramp', 'charter'];

export const SHOP_KIND_LABEL: Record<ShopKind, string> = {
  tackle: 'Tackle',
  bait: 'Bait',
  marina: 'Marina',
  ramp: 'Boat ramp',
  charter: 'Charter',
};
