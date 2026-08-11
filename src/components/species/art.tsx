/**
 * Inline art for the species screens.
 *
 * Drawn rather than photographed, for the same reason the location screens draw
 * their own diagrams: a generic outline owes nobody a licence, ships inside the
 * bundle so it works offline, and takes its colour from the theme tokens.
 */
import type { ReactElement } from 'react';
import type { BaitIcon } from './speciesContent';

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

/* ------------------------------------------------------------- bait & lures */

/*
 * Palette. Same rules as the habitat glyphs in components/location/art.tsx:
 * fixed steps of the two brand ramps plus the neutral ramp, no new hues, and
 * the scene carries its own dark ground (--b900, painted by `.bait .swatch`)
 * so one drawing reads identically in both themes instead of needing two.
 *
 * The split is systematic and matches the label under each card: natural baits
 * are drawn in the blue ramp, artificials in the lime ramp, hardware (hooks,
 * lead, blades) in the neutral ramp.
 */
const NAT = '#5b98f0'; /* --b400 — live/natural bait body */
const NAT_DEEP = '#0746a3'; /* --b700 — detail, only ever drawn on top of NAT */
const ART = '#8dff00'; /* --g400 — artificial body */
const ART_DEEP = '#3d6f00'; /* --g700 — detail, only ever on top of ART */
const ART_LITE = '#d3ffa3'; /* --g200 — highlight on top of ART */
const METAL = '#c4d2e0'; /* --n40 — lead, blades */
const WIRE = '#9eb0c3'; /* --n50 — hook wire, antennae, split rings */
const HOLE = '#031530'; /* --b900 — eyes: the ground colour, punched through */

/**
 * One drawing per bait category (see `BaitIcon` in speciesContent).
 *
 * 74x42 to match the swatch strip on the species card. Flat, iconographic and
 * side-on: these are category marks sitting beside the name in text, not
 * identification plates, so they are drawn to be recognisable at 42px rather
 * than to be accurate about a species.
 */
const BAIT_GLYPHS: Record<BaitIcon, ReactElement> = {
  /* Live baitfish — pilchard, pinfish, mullet, threadfin. Side-on, head right,
     with the lateral line called out the way the habitat glyphs call out their
     subject. */
  baitfish: (
    <>
      <path d="M18 21 L 7 11 L 10 21 L 7 31 Z" fill={NAT} />
      <path d="M18 21 C 28 9, 52 8, 66 21 C 52 34, 28 33, 18 21 Z" fill={NAT} />
      <path d="M52 12 C 56 16, 56 26, 52 30" stroke={NAT_DEEP} strokeWidth="1.8" fill="none" />
      <path d="M26 22 H 50" stroke={ART} strokeWidth="1.8" strokeDasharray="4 3" />
      <circle cx="59" cy="19" r="2.2" fill={HOLE} />
    </>
  ),

  /* Shrimp — the curl is the whole tell at this size: fan tail up-left, head
     and antennae down-right. */
  shrimp: (
    <>
      <path
        d="M52 13 C 63 19, 60 32, 45 33 C 30 34, 21 26, 25 18"
        fill="none"
        stroke={NAT}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path d="M27 19 L 8 8 L 13 19 L 8 30 Z" fill={NAT} />
      <path d="M36 30 L 38 38 M45 30 L 47 37" stroke={NAT_DEEP} strokeWidth="1.8" />
      <path d="M54 11 C 62 7, 68 9, 70 13" stroke={WIRE} strokeWidth="1.6" fill="none" />
      <path d="M55 15 C 63 16, 68 20, 69 25" stroke={WIRE} strokeWidth="1.6" fill="none" />
      <circle cx="51" cy="16" r="2.2" fill={ART} />
    </>
  ),

  /* Crustacean — pass crab, fiddler, blue crab, sand flea. Claws and legs go
     down first so the shell hides every joint. */
  crustacean: (
    <>
      <path
        d="M27 32 L 21 39 M33 34 L 30 40 M41 34 L 44 40 M47 32 L 53 39"
        stroke={NAT}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M24 25 L 15 21 M50 25 L 59 21" stroke={NAT} strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="37" cy="25" rx="16" ry="10" fill={NAT} />
      <path d="M24 22 C 30 19, 44 19, 50 22" stroke={NAT_DEEP} strokeWidth="1.6" fill="none" />
      {/* Pincers: a blob with the jaw gap punched back out in the ground colour,
          which is what makes them read as claws and not as feelers. */}
      <circle cx="12" cy="19" r="7" fill={NAT} />
      <circle cx="62" cy="19" r="7" fill={NAT} />
      <path d="M13 19 L 2 14 L 2 24 Z M61 19 L 72 14 L 72 24 Z" fill={HOLE} />
      <circle cx="32" cy="20" r="2.2" fill={ART} />
      <circle cx="42" cy="20" r="2.2" fill={ART} />
    </>
  ),

  /* Cut bait — the same baitfish with the tail end gone. The cut face is the
     subject, so it is the thing drawn in lime. */
  cutbait: (
    <>
      <path
        d="M23 10 L 31 14 L 23 18 L 31 22 L 23 26 L 31 30 L 23 34 C 42 37, 59 30, 63 21 C 59 12, 42 5, 23 10 Z"
        fill={NAT}
      />
      <path d="M48 11 C 52 15, 52 27, 48 31" stroke={NAT_DEEP} strokeWidth="1.8" fill="none" />
      <path
        d="M23 10 L 31 14 L 23 18 L 31 22 L 23 26 L 31 30 L 23 34"
        fill="none"
        stroke={ART}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="56" cy="18" r="2.2" fill={HOLE} />
    </>
  ),

  /* Soft plastic — paddletail / jerk shad. The paddle and the pinched waist
     are what separate it from the baitfish it imitates. */
  softplastic: (
    <>
      <path d="M31 17 C 24 16, 18 14, 13 10 C 6 14, 5 29, 13 32 C 18 28, 24 26, 31 25 Z" fill={ART} />
      <path d="M13 12 C 10 18, 10 25, 13 30" stroke={ART_DEEP} strokeWidth="1.8" fill="none" />
      <path d="M64 21 C 58 13, 46 10, 34 14 L 28 21 L 34 28 C 46 32, 58 29, 64 21 Z" fill={ART} />
      <path
        d="M41 13 C 43 18, 43 24, 41 29 M51 13 C 53 18, 53 24, 51 28"
        stroke={ART_DEEP}
        strokeWidth="1.6"
        fill="none"
      />
      <path d="M36 15 C 46 13, 55 15, 61 19" stroke={ART_LITE} strokeWidth="1.8" fill="none" />
    </>
  ),

  /* Jig — lead head, tie eye, skirt, hook. Drawn head-first because the head
     is the part you choose by weight. */
  jig: (
    <>
      <path d="M45 15 C 33 15, 20 21, 10 31 C 25 29, 38 25, 47 23 Z" fill={ART} />
      <path
        d="M40 17 C 30 19, 20 24, 13 29 M44 21 C 34 22, 24 25, 17 28"
        stroke={ART_DEEP}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M50 27 C 50 36, 42 40, 35 36 C 31 34, 31 30, 34 29"
        fill="none"
        stroke={WIRE}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="52" cy="18" r="9" fill={METAL} />
      <path d="M52 9 L 56 5" stroke={WIRE} strokeWidth="2" strokeLinecap="round" />
      <circle cx="58" cy="4" r="2.6" fill="none" stroke={WIRE} strokeWidth="1.6" />
      <circle cx="56" cy="15" r="2.2" fill={HOLE} />
    </>
  ),

  /* Spoon — a canted blade with the flash coming off it, split ring up, hook
     down. The lime inner face stands in for "gold" without leaving the ramps. */
  spoon: (
    <>
      <path
        d="M24 36 C 17 41, 10 38, 11 31 M11 31 L 8 34"
        fill="none"
        stroke={WIRE}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <ellipse cx="34" cy="21" rx="10" ry="16" transform="rotate(35 34 21)" fill={METAL} />
      <ellipse cx="34" cy="21" rx="5" ry="11" transform="rotate(35 34 21)" fill={ART} />
      <circle cx="47" cy="6" r="3.4" fill="none" stroke={WIRE} strokeWidth="1.8" />
      <path d="M55 13 L 62 10 M57 19 L 65 20" stroke={ART} strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),

  /* Hard bait / topwater plug — cigar body, two trebles, and the wake it drags
     behind it, which is the entire reason to throw one. */
  plug: (
    <>
      <path d="M8 9 C 16 5, 26 5, 33 8" fill="none" stroke={ART} strokeWidth="1.8" strokeDasharray="4 3" />
      <path
        d="M28 30 C 28 36, 24 39, 19 37 M44 30 C 44 36, 40 39, 35 37"
        fill="none"
        stroke={WIRE}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <ellipse cx="38" cy="20" rx="21" ry="9" fill={ART} />
      <path d="M52 13 C 57 16, 59 18, 59 20 C 59 22, 57 24, 52 27 Z" fill={ART_DEEP} />
      <path d="M22 16 C 30 14, 40 14, 47 16" stroke={ART_DEEP} strokeWidth="1.6" fill="none" />
      <circle cx="28" cy="29" r="2.6" fill={METAL} />
      <circle cx="44" cy="29" r="2.6" fill={METAL} />
      <circle cx="52" cy="17" r="2.2" fill={HOLE} />
    </>
  ),

  /* Fallback for a natural bait the keyword table does not know: something on
     a hook, drawn soft and round, claiming nothing about what it is. */
  natural: (
    <>
      <ellipse cx="36" cy="25" rx="13" ry="9" fill={NAT} />
      <path
        d="M43 9 V 22 C 43 32, 34 38, 26 35 C 20 33, 19 26, 24 23 M24 23 L 22 28"
        fill="none"
        stroke={WIRE}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="43" cy="6" r="3" fill="none" stroke={WIRE} strokeWidth="1.6" />
      <path d="M28 21 C 33 18, 41 20, 45 24" stroke={NAT_DEEP} strokeWidth="1.6" fill="none" />
    </>
  ),

  /* Fallback for an artificial: a hard-edged blade on a ring and a hook — the
     generic "something you tie on", as opposed to something that was alive. */
  artificial: (
    <>
      <path
        d="M50 33 C 42 39, 33 37, 31 30 M31 30 L 28 34"
        fill="none"
        stroke={WIRE}
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path d="M52 8 L 60 20 L 52 32 L 30 26 L 24 20 L 30 14 Z" fill={ART} />
      <path d="M30 14 L 52 20 L 30 26" fill="none" stroke={ART_DEEP} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="21" cy="20" r="3" fill="none" stroke={WIRE} strokeWidth="1.6" />
      <circle cx="47" cy="15" r="2.2" fill={HOLE} />
    </>
  ),
};

/** Every category that has a drawing — exported so tests can prove none is missing. */
export const BAIT_ICON_IDS = Object.keys(BAIT_GLYPHS) as BaitIcon[];

/**
 * The illustration for one bait/lure card.
 *
 * Decorative: the card prints the bait's name and whether it is natural or
 * artificial in text right underneath, so the drawing never carries meaning on
 * its own. It always renders something — an unknown id falls back to the
 * generic natural-bait shape rather than the blank box this replaced.
 */
export function BaitGlyph({ icon }: { icon: BaitIcon }) {
  return (
    <svg
      viewBox="0 0 74 42"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {BAIT_GLYPHS[icon] ?? BAIT_GLYPHS.natural}
    </svg>
  );
}

export default FishFramingGuide;
