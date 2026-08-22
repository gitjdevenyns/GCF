/**
 * Editorial review queue.
 *
 * Research arrives as prose in `docs/research/*.md`. It cannot go straight
 * into the guide: every proposed line needs a human to accept it, rewrite it,
 * or throw it out, and that decision has to survive across days of working
 * through a backlog a few items at a time.
 *
 * The split here matches the rest of the app. **Items are bundled** — they are
 * content proposals, they belong in version control where a diff shows what
 * changed, and bundling them means the review screen works offline and needs
 * no seeding step. **Decisions live in Supabase**, because they are made daily
 * and must persist the instant they are made, without a deploy.
 *
 * One thing this deliberately does NOT do: accepting an item does not change
 * the app. Guide content is compiled into the bundle, so an accepted item is
 * a queued edit — `npm run review:export` turns the accepted set into a patch
 * to apply to `src/data/`. Pretending otherwise would leave the owner thinking
 * a closure notice had shipped when it had not.
 */

export type ReviewKind =
  /** A practical access note: hours, parking, fees, ramps, restrooms. */
  | 'access_note'
  /** A hazard at that specific place. */
  | 'safety'
  /** A seasonal window string, e.g. "Apr–Oct snook along the mangrove edges". */
  | 'seasons'
  /** dawn | day | dusk | night. */
  | 'daypart'
  /** A citable source to attach to a location. */
  | 'source'
  /** A tackle/bait business proposed for the directory. */
  | 'shop'
  /** Something in the guide is now WRONG — a closure, a bad coordinate. */
  | 'alert'
  /** Cross-cutting guide content, e.g. a licence or permit requirement. */
  | 'permit';

export type Confidence = 'high' | 'medium' | 'insufficient';

export interface ReviewSource {
  url: string;
  /** What the page actually said. Verbatim — this is what makes it checkable. */
  quote: string;
  publisher?: string;
}

export interface ReviewItem {
  /** Stable across regenerations. Decisions are keyed to it, so it must not drift. */
  id: string;
  kind: ReviewKind;
  /** Location slug, shop slug, or 'GUIDE' for anything cross-cutting. */
  target: string;
  /** Human-readable name of the target, for the review screen. */
  target_label: string;
  /** The exact text proposed for the data. Ready to paste, not a summary. */
  proposed: string;
  /** Why this is being proposed, when it is not self-evident. */
  rationale?: string;
  sources: ReviewSource[];
  confidence: Confidence;
  /**
   * True when the claim can go stale fast — construction, seasonal closures,
   * fees, opening hours. These need a re-check immediately before publish, not
   * just an accept.
   */
  time_sensitive: boolean;
  /**
   * True when the guide is currently telling readers something wrong. A closed
   * dock or a coordinate on the wrong bank outranks a nice-to-have season note,
   * and the review screen sorts on this.
   */
  urgent: boolean;
  /** Which research file this came from, so the full context is findable. */
  origin: string;
}

export type ReviewStatus =
  /** Not yet looked at. */
  | 'pending'
  /** Take the proposed text as written. */
  | 'accepted'
  /** Take it, but with the owner's own wording in `final_text`. */
  | 'rewritten'
  /** Do not use. */
  | 'skipped'
  /** Cannot decide yet — needs a phone call or a site visit. */
  | 'needs_info';

export interface ReviewDecision {
  item_id: string;
  status: ReviewStatus;
  /** The owner's wording, when status is 'rewritten'. */
  final_text: string | null;
  /** Free note — "called them, hours confirmed", "ask FDOT". */
  note: string | null;
  decided_at: string | null;
  /** Set once the accepted text has actually reached src/data and shipped. */
  published_at: string | null;
}

/** What the review screen shows per item once a decision is merged in. */
export interface ReviewRow extends ReviewItem {
  status: ReviewStatus;
  final_text: string | null;
  note: string | null;
  decided_at: string | null;
  published_at: string | null;
}

export const REVIEW_STATUSES: ReviewStatus[] = [
  'pending', 'accepted', 'rewritten', 'skipped', 'needs_info',
];

export const KIND_LABEL: Record<ReviewKind, string> = {
  alert: 'Correction',
  access_note: 'Access',
  safety: 'Safety',
  seasons: 'Season',
  daypart: 'Daypart',
  source: 'Source',
  shop: 'Shop',
  permit: 'Permit',
};

/** The text that will ship: the owner's rewrite if there is one, else the proposal. */
export const finalTextOf = (r: ReviewRow): string => r.final_text?.trim() || r.proposed;

/** Accepted or rewritten, and not yet shipped. This is what export emits. */
export const isQueuedForPublish = (r: ReviewRow): boolean =>
  (r.status === 'accepted' || r.status === 'rewritten') && !r.published_at;
