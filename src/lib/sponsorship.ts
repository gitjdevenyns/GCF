/**
 * Paid-placement contract.
 *
 * The commercial layer, kept strictly separate from the editorial directory in
 * `src/data/shops.ts`. A shop's *presence* in the guide is editorial and
 * bundled; a shop's *prominence* is sold, lives in Supabase, and is bounded by
 * dates. Nothing here can add a shop, remove one, or alter a researched fact.
 *
 * Why Supabase rather than a bundled module, when everything else is bundled:
 * sponsorships start, lapse and renew on their own schedule. A deal that ends
 * on the 31st must stop showing on the 1st whether or not anyone deployed
 * that week, and signing a shop up in their car park should not require a
 * build. So this follows the same additive contract as live conditions —
 * offline or unconfigured, the guide simply shows the editorial directory,
 * which is complete and correct on its own.
 *
 * Two safety properties this module exists to guarantee:
 *
 *  1. NOTHING IS SPONSORED BY DEFAULT. Every parse failure, missing field or
 *     hostile value collapses to `NO_PLACEMENTS` — no pin, no boost, no logo.
 *     A bug can therefore cost a paying advertiser their placement, which is a
 *     phone call, but can never invent an advertisement, which is a liability.
 *
 *  2. PAID PLACEMENT IS ALWAYS DISCLOSED. Anything rendered because money
 *     changed hands carries `SPONSOR_LABEL` where a reader sees it. This is
 *     not a stylistic preference: undisclosed paid placement is deceptive
 *     advertising, and this guide's credibility is the product. Components
 *     must route sponsored content through a wrapper that renders the badge,
 *     so it cannot be forgotten at a call site.
 */

/**
 * The capability set a sponsorship grants.
 *
 * Deliberately a set of independent switches rather than a fixed tier enum:
 * tiers ("Bronze", "Local Partner", whatever a given deal turns out to be) are
 * presets composed from these, stored per row, and changed without a code
 * change. `label` carries whatever the deal is called.
 */
export interface SponsorPlacements {
  /** A distinct, labelled pin for this shop on maps. */
  map_pin: boolean;
  /** An enhanced detail page: logo, offer, richer layout. */
  enhanced_page: boolean;
  /** Show the shop's logo wherever it is listed. */
  logo: boolean;
  /** Sort weight in the directory. Higher floats up; 0 keeps editorial order. */
  directory_rank: number;
  /** Location slugs whose page may show this shop's sponsor card. [] = none. */
  location_slugs: string[];
}

/** The safe default. Every failure path resolves here. */
export const NO_PLACEMENTS: SponsorPlacements = {
  map_pin: false,
  enhanced_page: false,
  logo: false,
  directory_rank: 0,
  location_slugs: [],
};

/** The disclosure every paid placement must carry, verbatim. */
export const SPONSOR_LABEL = 'Sponsored';

export interface Sponsorship {
  /** Slug of a shop in `src/data/shops.ts`. A slug with no shop is dropped. */
  shop_slug: string;
  /** The owner's own name for this deal. Display-only. */
  label: string | null;
  /** ISO-8601. Null means "already running". */
  starts_at: string | null;
  /** ISO-8601. Null means "until cancelled". */
  ends_at: string | null;
  /** Absolute URL to the shop's logo, or null. */
  logo_url: string | null;
  /** Short advertiser-supplied line. Advertiser's words, never the guide's. */
  offer_text: string | null;
  placements: SponsorPlacements;
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const asString = (v: unknown): string | null =>
  typeof v === 'string' && v.trim() !== '' ? v.trim() : null;

const asBool = (v: unknown): boolean => v === true;

const asRank = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
};

const asSlugList = (v: unknown): string[] =>
  Array.isArray(v) ? v.map(asString).filter((s): s is string => s !== null) : [];

/** Total: any shape that is not recognisably a placement set yields no placements. */
export function parsePlacements(payload: unknown): SponsorPlacements {
  if (!isRecord(payload)) return NO_PLACEMENTS;
  return {
    map_pin: asBool(payload.map_pin),
    enhanced_page: asBool(payload.enhanced_page),
    logo: asBool(payload.logo),
    directory_rank: asRank(payload.directory_rank),
    location_slugs: asSlugList(payload.location_slugs),
  };
}

/**
 * Is this sponsorship live at `now`?
 *
 * Checked here as well as in the database policy. The server is the authority
 * — anon cannot read a row outside its window at all — but a cached response
 * can outlive the deal it describes, and showing an expired advertisement is
 * both a billing problem and a trust one.
 */
export function isActive(s: Sponsorship, now = Date.now()): boolean {
  const start = s.starts_at ? Date.parse(s.starts_at) : null;
  const end = s.ends_at ? Date.parse(s.ends_at) : null;
  if (start !== null && !Number.isNaN(start) && now < start) return false;
  if (end !== null && !Number.isNaN(end) && now >= end) return false;
  return true;
}

/**
 * Parses rows from the `sponsorship_active` view into active sponsorships.
 *
 * Pure and total. A row missing a shop slug is dropped entirely — an
 * advertisement that cannot be attributed to a named business must not render.
 */
export function parseSponsorships(payload: unknown, now = Date.now()): Sponsorship[] {
  if (!Array.isArray(payload)) return [];
  const out: Sponsorship[] = [];
  for (const row of payload) {
    if (!isRecord(row)) continue;
    const shop_slug = asString(row.shop_slug);
    if (!shop_slug) continue;
    const s: Sponsorship = {
      shop_slug,
      label: asString(row.label),
      starts_at: asString(row.starts_at),
      ends_at: asString(row.ends_at),
      logo_url: asString(row.logo_url),
      offer_text: asString(row.offer_text),
      placements: parsePlacements(row.placements),
    };
    if (isActive(s, now)) out.push(s);
  }
  return out;
}

/** Index by shop slug, for the O(1) lookup every listing does. */
export function bySlug(sponsorships: Sponsorship[]): Map<string, Sponsorship> {
  return new Map(sponsorships.map((s) => [s.shop_slug, s]));
}
