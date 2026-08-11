/**
 * Inline art for the species screens.
 *
 * Drawn rather than photographed, for the same reason the location screens draw
 * their own diagrams: a generic outline owes nobody a licence, ships inside the
 * bundle so it works offline, and takes its colour from the theme tokens.
 */

/**
 * Framing guide for the photo-ID screen.
 *
 * A plain outline of a fish at the size and orientation that actually
 * identifies well: whole animal, side-on, head to the right, filling the frame.
 * Nearly every failed identification is a composition problem — a fish shot
 * three-quarters-on, cropped through the tail, or lost against a dark deck —
 * and the marks that separate these species (a tail spot, a lateral line, a
 * dorsal filament, a jaw line) all live on the flank. Showing the target shape
 * before the camera opens is the cheapest possible fix for that.
 *
 * It is a guide, not content: an outline only, decorative to assistive tech,
 * with the same instruction carried in the visible text beside it.
 */
export function FishFramingGuide() {
  return (
    <svg
      viewBox="0 0 320 160"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* Body, from the snout over the back, out through the forked tail and
          home along the belly. */}
      <path
        d="M298 80
           C274 56, 244 42, 208 40
           C168 38, 122 48, 92 66
           C74 52, 52 34, 34 26
           C44 48, 56 66, 62 80
           C56 94, 44 112, 34 134
           C52 126, 74 108, 92 94
           C122 112, 168 124, 208 120
           C244 118, 274 104, 298 80 Z"
      />
      {/* Dorsal fin — both feet land on the back line (y≈39 at x=196, y≈46 at
          x=126), so the outline reads as one animal rather than a fish with a
          sail floating above it. */}
      <path d="M196 39 C186 16, 170 8, 152 10 C140 12, 130 28, 126 46" />
      {/* Anal fin */}
      <path d="M152 120 C148 134, 140 140, 130 141 C128 130, 124 118, 120 110" />
      {/* Pectoral fin */}
      <path d="M236 96 C226 112, 210 118, 198 116 C208 106, 216 98, 222 92" />
      {/* Gill cover */}
      <path d="M252 50 C240 66, 240 96, 252 110" />
      {/* Mouth */}
      <path d="M296 82 C288 85, 281 87, 274 88" />
      <circle cx="271" cy="70" r="6" />
    </svg>
  );
}

export default FishFramingGuide;
