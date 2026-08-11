/**
 * Radial callout geometry for the annotated identification plate.
 *
 * WHY THIS EXISTS
 * ---------------
 * The numbered pin used to sit directly on top of the feature it names, and a
 * lime disc that size covers the very thing the reader is being asked to look
 * at. The pins now live in a gutter *around* the photograph and reach back to
 * the feature with a thin leader line; the feature keeps a small dot so the
 * exact point is still marked.
 *
 * The `top` / `left` percentages in `speciesContent.ts` are NOT touched by any
 * of this. They are still the verified position of the anatomical feature on
 * that species' photograph — this module only decides where the *label* for
 * that point goes and how the line gets back to it.
 *
 * COORDINATE SYSTEMS
 * ------------------
 * - Mark data is a fraction of the PHOTO box (0..1 across, 0..1 down).
 * - All internal maths happens in "width units": x and y are both fractions of
 *   the PLATE's width, so angles and distances are true. (A percent of height
 *   and a percent of width are different lengths; mixing them skews every
 *   angle.)
 * - What we export is percentages of the PLATE box, ready to drop straight
 *   into CSS `left` / `top` and into SVG `x`/`y` attributes.
 *
 * THE LAYOUT
 * ----------
 * 1. Project a ray from the centre of the photo through the feature point.
 * 2. Where that ray leaves the plate, park the pin — specifically on the
 *    "ring": the rectangle running down the middle of the gutter. A feature on
 *    the fish's snout gets a pin off the snout end, a feature on the dorsal
 *    gets a pin above it. Nothing ever covers the fish.
 * 3. Slide pins along that ring until no two are closer than `MIN_ARC`. The
 *    ring is a closed loop, so this is a one-dimensional separation problem
 *    and it cannot push a pin off the plate — every point of the ring is a
 *    legal position by construction.
 *
 * The plate's own aspect ratio falls out of the two constants below and is
 * mirrored in `pages.css`; `idplate.test.tsx` fails if the two drift apart.
 */

/** Gutter around the photo, as a fraction of the plate WIDTH — equal on all four sides in px. */
export const GUTTER = 0.1;

/** Aspect ratio (w/h) of the photo box. 3:2 is the crop the marks were calibrated against. */
export const PHOTO_ASPECT = 1.5;

/** Plate height, in width units. */
export const PLATE_H = 2 * GUTTER + (1 - 2 * GUTTER) / PHOTO_ASPECT;

/** Plate aspect ratio (w/h) — this is what CSS puts on `.idplate`. */
export const PLATE_ASPECT = 1 / PLATE_H;

/** Photo inset from the top/bottom of the plate, as a percentage of plate HEIGHT. */
export const PHOTO_INSET_Y_PCT = (GUTTER / PLATE_H) * 100;

/** Photo inset from the left/right of the plate, as a percentage of plate WIDTH. */
export const PHOTO_INSET_X_PCT = GUTTER * 100;

/** Pins ride the middle of the gutter, so they always clear both plate edge and photo. */
export const RING_INSET = GUTTER / 2;

/**
 * Minimum spacing between two pins, measured along the ring, in width units.
 * The binding case is the narrowest plate we render (a 320px phone gives a
 * ~288px plate, where the 24px pin plus its ring is 0.097 width units). Arc
 * distance is only shorter than straight-line distance when a pair straddles a
 * corner, and never by more than a factor of √2, so this leaves real headroom.
 */
export const MIN_ARC = 0.17;

export interface MarkPoint {
  n: number;
  /** Percentage across the photo, e.g. `'53%'`. */
  left: string;
  /** Percentage down the photo, e.g. `'44%'`. */
  top: string;
}

export interface PlacedMark {
  n: number;
  /** The exact feature point, as a percentage of the plate box. */
  fx: number;
  fy: number;
  /** Centre of the numbered pin, as a percentage of the plate box. */
  px: number;
  py: number;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const fraction = (pct: string) => {
  const v = Number.parseFloat(pct);
  return Number.isFinite(v) ? clamp01(v / 100) : 0.5;
};

/** The ring rectangle, in width units. */
const RING = {
  x0: RING_INSET,
  x1: 1 - RING_INSET,
  y0: RING_INSET,
  y1: PLATE_H - RING_INSET,
};

const RW = RING.x1 - RING.x0;
const RH = RING.y1 - RING.y0;

/** Length of the ring loop, in width units. */
export const RING_PERIMETER = 2 * (RW + RH);

/** Distance clockwise from the ring's top-left corner to a point on the ring. */
function toArc(x: number, y: number): number {
  const onTop = Math.abs(y - RING.y0) < 1e-9;
  const onBottom = Math.abs(y - RING.y1) < 1e-9;
  const onLeft = Math.abs(x - RING.x0) < 1e-9;
  if (onTop) return x - RING.x0;
  if (!onBottom && !onLeft) return RW + (y - RING.y0); // right edge
  if (onBottom) return RW + RH + (RING.x1 - x);
  return 2 * RW + RH + (RING.y1 - y); // left edge
}

/** Inverse of `toArc`. */
function fromArc(s: number): { x: number; y: number } {
  let t = s % RING_PERIMETER;
  if (t < 0) t += RING_PERIMETER;
  if (t <= RW) return { x: RING.x0 + t, y: RING.y0 };
  t -= RW;
  if (t <= RH) return { x: RING.x1, y: RING.y0 + t };
  t -= RH;
  if (t <= RW) return { x: RING.x1 - t, y: RING.y1 };
  t -= RW;
  return { x: RING.x0, y: RING.y1 - t };
}

/** Where a ray leaving the plate centre in direction (dx, dy) crosses the ring. */
function rayToRing(dx: number, dy: number): { x: number; y: number } {
  const cx = 0.5;
  const cy = PLATE_H / 2;
  const tx = dx > 0 ? (RING.x1 - cx) / dx : dx < 0 ? (RING.x0 - cx) / dx : Infinity;
  const ty = dy > 0 ? (RING.y1 - cy) / dy : dy < 0 ? (RING.y0 - cy) / dy : Infinity;
  const t = Math.min(tx, ty);
  const x = Math.min(RING.x1, Math.max(RING.x0, cx + dx * t));
  const y = Math.min(RING.y1, Math.max(RING.y0, cy + dy * t));
  return { x, y };
}

const round = (v: number) => Math.round(v * 1000) / 1000;

/**
 * Place every mark's pin in the gutter, radially outward from its feature.
 *
 * Deterministic: same marks in, same numbers out, no measurement of the DOM.
 * That is what lets `idplate.test.tsx` check every mark in the guide — 46 of
 * them, across 11 species — for out-of-bounds pins, pin-on-pin collisions,
 * leaders that miss their feature and leaders that cross each other.
 */
export function placeMarks(marks: readonly MarkPoint[]): PlacedMark[] {
  if (marks.length === 0) return [];

  const cx = 0.5;
  const cy = PLATE_H / 2;

  // Feature point + its unseparated position on the ring.
  const seeded = marks.map((m) => {
    const u = fraction(m.left);
    const v = fraction(m.top);
    const fx = GUTTER + u * (1 - 2 * GUTTER);
    const fy = GUTTER + v * (PLATE_H - 2 * GUTTER);
    let dx = fx - cx;
    let dy = fy - cy;
    if (Math.hypot(dx, dy) < 1e-6) {
      // Dead centre of the photo: no outward direction to speak of, so send it
      // straight up rather than dividing by zero.
      dx = 0;
      dy = -1;
    }
    const seat = rayToRing(dx, dy);
    return { n: m.n, fx, fy, arc: toArc(seat.x, seat.y) };
  });

  // Separate along the ring. Sorted once and kept in that order: every push is
  // small and outward, so the cyclic order never changes under it.
  const order = [...seeded].sort((a, b) => a.arc - b.arc || a.n - b.n);
  const count = order.length;
  const room = RING_PERIMETER / count;
  const sep = Math.min(MIN_ARC, room * 0.98);

  if (count > 1) {
    for (let pass = 0; pass < 80; pass += 1) {
      let moved = false;
      for (let i = 0; i < count; i += 1) {
        const a = order[i];
        const b = order[(i + 1) % count];
        let gap = b.arc - a.arc;
        if (i === count - 1) gap += RING_PERIMETER;
        if (gap < sep - 1e-9) {
          const push = (sep - gap) / 2;
          a.arc -= push;
          b.arc += push;
          moved = true;
        }
      }
      if (!moved) break;
    }
  }

  const placed = new Map<number, PlacedMark>();
  for (const m of order) {
    const pin = fromArc(m.arc);
    placed.set(m.n, {
      n: m.n,
      fx: round(m.fx * 100),
      fy: round((m.fy / PLATE_H) * 100),
      px: round(pin.x * 100),
      py: round((pin.y / PLATE_H) * 100),
    });
  }

  // Emit in the order the marks were authored, so the DOM order matches the
  // numbered list beside the plate.
  return marks.map((m) => placed.get(m.n) as PlacedMark);
}
