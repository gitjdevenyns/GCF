/**
 * Paid placement, in two separate products.
 *
 * The owner sells two different things and they must not share a data model,
 * because they answer to different rules:
 *
 * **Shop listings** attach to a business already in the researched directory
 * (`src/data/shops.ts`). Payment upgrades how a *real, editorially-chosen*
 * shop appears. It can never add a shop, hide a competitor, or alter a
 * researched fact — the directory is the reason anyone reads the section, and
 * a directory of advertisers has no readers and therefore nothing to sell.
 *
 * **Ad campaigns** are open advertising from anyone — charter captains,
 * restaurants, tourism boards — with no connection to the directory and no
 * editorial claim behind them. They live in declared slots and are always
 * labelled.
 *
 * Two safety properties hold across both:
 *
 *  1. NOTHING IS PAID BY DEFAULT. Every parse failure collapses to the free
 *     shape. A bug can cost an advertiser their placement, which is a phone
 *     call; it can never invent an advertisement, which is a liability.
 *
 *  2. PAID PLACEMENT IS ALWAYS DISCLOSED, and the disclosure is structural —
 *     `AdSlot` has no prop that suppresses it. Undisclosed paid placement is
 *     deceptive advertising, and this guide's credibility is the product.
 */

export const SPONSOR_LABEL = 'Sponsored';

/* ------------------------------------------------------------ shop listings */

export type ListingTier =
  /** In the directory, unenhanced. What every included shop gets, free. */
  | 'basic'
  /** Paid. Unlocks the assets below. */
  | 'enhanced';

/**
 * What a shop supplies once it pays.
 *
 * Everything here is the advertiser's own material, presented as theirs. The
 * guide never writes an owner's statement or invents an offer, and a shop's
 * researched facts (address, phone, what it carries) stay editorial and are
 * not editable from here.
 */
export interface EnhancedContent {
  /** Absolute URL to the shop's logo. */
  logo_url: string | null;
  /** Up to `MAX_PHOTOS`. The inside of a real shop sells better than a stock photo. */
  photos: string[];
  /** A quote from the owner, in their words. */
  statement: string | null;
  /** Who said it — "Bruce, owner since 1998". Attribution makes it credible. */
  statement_by: string | null;
  /** Short standing offer. The single most requested thing by advertisers. */
  offer_text: string | null;
  /** ISO date. The offer stops rendering after it, with no deploy. */
  offer_expires: string | null;
  /** One line under the shop name. */
  tagline: string | null;
}

export interface ListingPlacements {
  /** A distinct, labelled pin instead of a plain dot. */
  map_pin: boolean;
  /** An outbound link to the shop's own site. Basic listings do not get one. */
  website_link: boolean;
  /** A prominent tap-to-call button rather than plain text. */
  call_button: boolean;
  /** Sort weight in the directory. Higher floats up; 0 keeps editorial order. */
  directory_rank: number;
  /** Location pages that may carry this shop's sponsor card. [] = none. */
  location_slugs: string[];
}

export interface ShopListing {
  /** Slug of a shop in `src/data/shops.ts`. Unknown slugs are dropped. */
  shop_slug: string;
  /**
   * Whether the shop appears to readers at all.
   *
   * Editorial, not commercial: a researched shop can be excluded because its
   * details were never confirmed, and an unpaid shop is still included. This
   * is deliberately independent of `tier`.
   */
  included: boolean;
  tier: ListingTier;
  starts_at: string | null;
  ends_at: string | null;
  enhanced: EnhancedContent;
  placements: ListingPlacements;
}

export const MAX_PHOTOS = 6;

export const FREE_PLACEMENTS: ListingPlacements = {
  map_pin: false,
  website_link: false,
  call_button: false,
  directory_rank: 0,
  location_slugs: [],
};

export const EMPTY_ENHANCED: EnhancedContent = {
  logo_url: null, photos: [], statement: null, statement_by: null,
  offer_text: null, offer_expires: null, tagline: null,
};

/* ------------------------------------------------------------ ad campaigns */

export interface AdCampaign {
  id: string;
  /** Who is paying. Shown in the disclosure, so it is never optional. */
  advertiser: string;
  headline: string;
  body: string | null;
  image_url: string | null;
  /** Where the ad points. */
  href: string | null;
  /** Named slots this creative may fill, e.g. 'home.below_conditions'. */
  slots: string[];
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
}

/**
 * Ad slots the app declares.
 *
 * A fixed list, on purpose: a slot has to exist in a screen before it can be
 * sold, and this is the rate card. Adding one means adding an `<AdSlot>` too.
 */
export const AD_SLOTS = [
  { id: 'home.below_conditions', label: 'Home — under Conditions now', note: 'Highest traffic slot in the app.' },
  { id: 'location.below_plan', label: 'Location page — under the plan', note: 'Reaches someone deciding where to go right now.' },
  { id: 'shops.top', label: 'Shops — above the directory', note: 'Best fit for non-shop advertisers who still want a bait-buying audience.' },
  { id: 'tides.footer', label: 'Tides — footer', note: 'Low intent, high repeat: people check tides daily.' },
] as const;

/* ------------------------------------------------------------------ parsing */

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown): string | null =>
  typeof v === 'string' && v.trim() !== '' ? v.trim() : null;
const bool = (v: unknown): boolean => v === true;
const rank = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
};
const strList = (v: unknown, cap = 64): string[] =>
  Array.isArray(v) ? v.map(str).filter((s): s is string => s !== null).slice(0, cap) : [];

export function parsePlacements(v: unknown): ListingPlacements {
  if (!isRecord(v)) return FREE_PLACEMENTS;
  return {
    map_pin: bool(v.map_pin),
    website_link: bool(v.website_link),
    call_button: bool(v.call_button),
    directory_rank: rank(v.directory_rank),
    location_slugs: strList(v.location_slugs),
  };
}

export function parseEnhanced(v: unknown): EnhancedContent {
  if (!isRecord(v)) return EMPTY_ENHANCED;
  return {
    logo_url: str(v.logo_url),
    photos: strList(v.photos, MAX_PHOTOS),
    statement: str(v.statement),
    statement_by: str(v.statement_by),
    offer_text: str(v.offer_text),
    offer_expires: str(v.offer_expires),
    tagline: str(v.tagline),
  };
}

/** Is a dated record live at `now`? Checked client-side as well as in RLS. */
export function isLive(
  x: { starts_at: string | null; ends_at: string | null },
  now = Date.now(),
): boolean {
  const s = x.starts_at ? Date.parse(x.starts_at) : null;
  const e = x.ends_at ? Date.parse(x.ends_at) : null;
  if (s !== null && !Number.isNaN(s) && now < s) return false;
  if (e !== null && !Number.isNaN(e) && now >= e) return false;
  return true;
}

export function parseShopListings(payload: unknown, now = Date.now()): ShopListing[] {
  if (!Array.isArray(payload)) return [];
  const out: ShopListing[] = [];
  for (const row of payload) {
    if (!isRecord(row)) continue;
    const shop_slug = str(row.shop_slug);
    if (!shop_slug) continue;
    const tier: ListingTier = row.tier === 'enhanced' ? 'enhanced' : 'basic';
    const l: ShopListing = {
      shop_slug,
      included: bool(row.included),
      tier,
      starts_at: str(row.starts_at),
      ends_at: str(row.ends_at),
      // An expired or not-yet-started deal renders as a basic listing rather
      // than vanishing: the shop is still editorially in the directory, it has
      // simply stopped paying for the extras.
      enhanced: tier === 'enhanced' && isLive(row as never, now)
        ? parseEnhanced(row.enhanced)
        : EMPTY_ENHANCED,
      placements: tier === 'enhanced' && isLive(row as never, now)
        ? parsePlacements(row.placements)
        : FREE_PLACEMENTS,
    };
    out.push(l);
  }
  return out;
}

export function parseAdCampaigns(payload: unknown, now = Date.now()): AdCampaign[] {
  if (!Array.isArray(payload)) return [];
  const out: AdCampaign[] = [];
  for (const row of payload) {
    if (!isRecord(row)) continue;
    const id = str(row.id);
    const advertiser = str(row.advertiser);
    const headline = str(row.headline);
    // No advertiser name means no honest disclosure, so the ad cannot render.
    if (!id || !advertiser || !headline) continue;
    const c: AdCampaign = {
      id, advertiser, headline,
      body: str(row.body),
      image_url: str(row.image_url),
      href: str(row.href),
      slots: strList(row.slots),
      starts_at: str(row.starts_at),
      ends_at: str(row.ends_at),
      active: bool(row.active),
    };
    if (c.active && isLive(c, now)) out.push(c);
  }
  return out;
}

export const listingBySlug = (l: ShopListing[]): Map<string, ShopListing> =>
  new Map(l.map((x) => [x.shop_slug, x]));
