import type { IdMark } from '../ui';

/**
 * Per-species editorial that the migrated `FISH` record does not carry:
 * identification marks, confusable species and a one-line lede.
 *
 * PROVENANCE / HONESTY
 * --------------------
 * - Every entry here is a *field mark* — a visible, checkable feature of the
 *   animal (fin count, jaw shape, a spot, a stripe). These are the standard
 *   identification characters published in the Florida Museum species profiles
 *   that also supply the ID photographs in `src/data/fish.ts`, and the page
 *   links to that source.
 * - Nothing here states, implies or paraphrases a regulation. Seasons, slot,
 *   bag limits and permits are never given as numbers — the species page points
 *   at FWC instead (see the "local heuristics" callout in FishDetail).
 * - Marks are ranked: `decisive` marks settle the identification on their own,
 *   `supporting` marks only ever confirm. The page says so in those words, so a
 *   variable feature is never presented as a definitive tell.
 * - `lede` describes where the animal lives and how it feeds. It restates the
 *   `habitat` field of the same record in plain language; it is a tactic, not a
 *   rule, and the page frames it that way.
 *
 * The snook entry is ported from design board "03 Species - Common Snook",
 * which is the authored source for this screen.
 *
 * Mark placement: percentages inside the ID plate. Marks are constrained to the
 * top ~62% of the plate (the caption bar owns the bottom) and no two marks are
 * placed within a halo width of each other at the 390px mobile size.
 */

export type MarkWeight = 'decisive' | 'supporting';

export interface SpeciesMark extends IdMark {
  /** Bold headline for the mark list. */
  title: string;
  /** The explanation under the headline. */
  body: string;
  weight: MarkWeight;
}

export interface Confusable {
  name: string;
  /** How to tell it apart. Only ever a visible difference. */
  tell: string;
}

export interface SpeciesContent {
  /** Short chips over the hero. */
  tags: string[];
  /** Opening paragraph — where it sits and how it feeds. */
  lede: string;
  /** Framing line above the ID plate. */
  idLede: string;
  marks: SpeciesMark[];
  confusables: Confusable[];
}

/** Screen-reader label for a mark = its headline without trailing punctuation. */
const mark = (
  n: number,
  left: string,
  top: string,
  title: string,
  body: string,
  weight: MarkWeight,
): SpeciesMark => ({ n, left, top, title, body, weight, label: title });

export const SPECIES_CONTENT: Record<string, SpeciesContent> = {
  snook: {
    tags: ['Ambush predator', 'Cold-sensitive'],
    lede:
      'Snook do not chase. They sit on the dark side of an edge — a root line, a piling, a bridge shadow — and let the current bring food past. Find the edge and the moving water, and you have found the fish.',
    idLede: 'One feature settles it. The rest are confirmation.',
    marks: [
      mark(
        1,
        '53%',
        '44%',
        'The black lateral line',
        'A hard, unbroken stripe from the gill cover to the tail. Nothing else inshore has it this crisp — if you can see this, you are done identifying.',
        'decisive',
      ),
      mark(
        2,
        '10%',
        '50%',
        'Sloping forehead, jutting lower jaw',
        'The profile runs down at an angle to an underbite — a scoop, not a point.',
        'decisive',
      ),
      mark(
        3,
        '27%',
        '36%',
        'Gill cover edge',
        'The rear rim of the gill plate is a blade. Note it while identifying, because it is also the thing that cuts you.',
        'supporting',
      ),
      mark(
        4,
        '50%',
        '18%',
        'Two separate dorsal fins',
        'A distinct gap between the spiny front fin and the soft rear fin.',
        'supporting',
      ),
      mark(
        5,
        '83%',
        '30%',
        'Yellow wash in the tail and pelvic fins',
        'Strong on some fish, faint on others — supporting evidence, never the deciding tell.',
        'supporting',
      ),
    ],
    confusables: [
      {
        name: 'Juvenile tarpon',
        tell: 'Also silver, also around mangroves. Tarpon have a big upturned mouth and a long trailing ray off the back of the dorsal fin. No black lateral stripe.',
      },
      {
        name: 'Ladyfish',
        tell: 'Slimmer, jumps constantly, no stripe, no underbite. Fun, but not what you came for.',
      },
    ],
  },

  redfish: {
    tags: ['Bottom feeder', 'Shallow structure'],
    lede:
      'Redfish work shallow, hard edges nose-down — oyster bars, grass margins, sand potholes and the drains that empty a flat. They feed with their heads on the bottom, which is why you often see the tail before the fish.',
    idLede: 'The tail spot settles it. Everything else is confirmation.',
    marks: [
      mark(
        1,
        '74%',
        '34%',
        'Black spot at the base of the tail',
        'At least one dark eye-spot where the body meets the tail. Some fish carry several, on one or both sides. No other inshore drum has it.',
        'decisive',
      ),
      mark(
        2,
        '24%',
        '55%',
        'No barbels on the chin',
        'Run your eye under the jaw: it is clean. Whiskers under the chin means you are holding a black drum, not a redfish.',
        'decisive',
      ),
      mark(
        3,
        '9%',
        '42%',
        'Blunt, down-turned snout',
        'The mouth sits low on the head, built for feeding down onto the bottom rather than up into the water column.',
        'supporting',
      ),
      mark(
        4,
        '45%',
        '20%',
        'Copper-bronze back',
        'Coppery above, fading to a pale belly. Colour swings with water clarity and bottom type — a hint, never the decision.',
        'supporting',
      ),
      mark(
        5,
        '84%',
        '58%',
        'Squared-off tail',
        'The tail edge is close to straight rather than deeply forked.',
        'supporting',
      ),
    ],
    confusables: [
      {
        name: 'Black drum',
        tell: 'Same shape, same water. Black drum have barbels under the chin, dark vertical bars on younger fish, and no spot at the base of the tail.',
      },
    ],
  },

  trout: {
    tags: ['Grass flats', 'Delicate — handle fast'],
    lede:
      'Spotted seatrout sit over grass and along the edges of the sand potholes inside it, facing into the current and waiting for something to cross the light-to-dark boundary. Find the pothole edges and you have found the fish.',
    idLede: 'The spots are the answer — but only because of where they run.',
    marks: [
      mark(
        1,
        '55%',
        '22%',
        'Round black spots that run onto the fins',
        'Scattered dark spots along the back that continue onto the dorsal fin and the tail. Spots on the fins are what separates this from every other trout inshore.',
        'decisive',
      ),
      mark(
        2,
        '86%',
        '34%',
        'Spots continue onto the tail',
        'Follow the spotting all the way back. If it stops at the body, it is not a spotted seatrout.',
        'decisive',
      ),
      mark(
        3,
        '12%',
        '40%',
        'Two large canine teeth in the upper jaw',
        'A pair of obvious fangs at the front of the top jaw. Worth knowing before you reach for the hook.',
        'supporting',
      ),
      mark(
        4,
        '36%',
        '54%',
        'Slender silver body, no chin barbels',
        'Elongated and soft-bodied, dark grey-green above and silver on the flank, with a clean chin.',
        'supporting',
      ),
    ],
    confusables: [
      {
        name: 'Sand / silver seatrout',
        tell: 'Same shape, same grass, but plain — pale silver-tan with no distinct black spots on the back, dorsal fin or tail.',
      },
    ],
  },

  tarpon: {
    tags: ['Migratory', 'Release big fish in the water'],
    lede:
      'Tarpon move — passes, beach edges, bridges and harbour mouths, usually on the tide rather than on the spot. You are looking for a moving fish in moving water, not a fish holding on a piece of structure.',
    idLede: 'Two features settle it before you ever get close.',
    // Placed against the Wikimedia Commons photograph in `src/data/fish.ts`,
    // which is the one lateral profile in the guide that faces *right* — head
    // at the right edge, tail at the left. Mirrored coordinates here are
    // deliberate, not a mistake.
    marks: [
      mark(
        1,
        '45%',
        '22%',
        'Long trailing filament off the dorsal fin',
        'The last ray of the dorsal fin extends into a whip that trails back over the body. Nothing else inshore has one.',
        'decisive',
      ),
      mark(
        2,
        '58%',
        '40%',
        'Very large, plate-like silver scales',
        'Scales you can count from the boat — coin-sized on an adult. This is the "silver king" look, and it is unmistakable.',
        'decisive',
      ),
      mark(
        3,
        '84%',
        '52%',
        'Upturned mouth, jutting lower jaw',
        'The mouth opens upward, built to feed on things above it. The jaw itself is hard and bony — one reason hooks pull.',
        'supporting',
      ),
      mark(
        4,
        '16%',
        '27%',
        'Deeply forked tail',
        'A big, deeply forked tail on a deep-bodied silver fish.',
        'supporting',
      ),
    ],
    confusables: [
      {
        name: 'Ladyfish',
        tell: 'The small silver fish people call a "poor man\'s tarpon". Much slimmer, small scales, and no trailing filament off the dorsal fin.',
      },
      {
        name: 'Juvenile tarpon vs snook',
        tell: 'Both are silver and both sit in the mangroves. Snook carry a hard black lateral stripe; tarpon never do.',
      },
    ],
  },

  snapper: {
    tags: ['Structure-hugging', 'Line-shy'],
    lede:
      'Mangrove snapper live tight to hard cover — root lines, dock pilings, bridge structure and rock. They rarely move far from it, so the cast has to land close, and the fish will try to take you straight back into it.',
    idLede: 'Check the teeth and the flank, in that order.',
    marks: [
      mark(
        1,
        '13%',
        '38%',
        'Two prominent canine teeth in the upper jaw',
        'A pair of obvious fangs at the front of the top jaw, visible with the mouth barely open. Keep fingers clear and use pliers.',
        'decisive',
      ),
      mark(
        2,
        '58%',
        '46%',
        'No dark spot on the flank',
        'A clean side. A dark spot high on the flank below the soft dorsal means lane snapper, not mangrove.',
        'decisive',
      ),
      mark(
        3,
        '26%',
        '22%',
        'Pointed snout, straight sloping head',
        'The head runs down to the mouth in an almost straight line — a wedge rather than a curve.',
        'supporting',
      ),
      mark(
        4,
        '86%',
        '30%',
        'Reddish-orange fin margins',
        'Grey to brassy body with a reddish cast in the fins, strongest on fish holding over rock and colour-shifted on fish over pale sand.',
        'supporting',
      ),
    ],
    confusables: [
      {
        name: 'Lane snapper',
        tell: 'Pink and yellow horizontal stripes along the flank plus a dark spot below the soft dorsal fin. Mangrove snapper has neither.',
      },
      {
        name: 'Cubera snapper',
        tell: 'Looks like an oversized mangrove snapper. Far heavier-bodied and rare inshore — if it is very large, do not assume.',
      },
    ],
  },
};

export const speciesContent = (id: string): SpeciesContent | undefined =>
  SPECIES_CONTENT[id];

/* ------------------------------------------------------------------ habitat */

/**
 * Maps a habitat phrase from `Fish.habitat` onto a Read Water habitat module,
 * so the "where it lives" chips deep-link into the module that teaches it.
 * A phrase with no module is still shown — it just is not a link.
 */
const HABITAT_KEYS: Array<[RegExp, string]> = [
  [/oyster/i, 'oyster'],
  [/grass|pothole/i, 'grass'],
  [/mangrove/i, 'mangrove'],
  [/pass|inlet/i, 'pass'],
  [/bridge/i, 'bridge'],
];

export function habitatModuleFor(phrase: string): string | null {
  const hit = HABITAT_KEYS.find(([re]) => re.test(phrase));
  return hit ? hit[1] : null;
}

/** `Fish.habitat` is a comma-separated list — split it into chips. */
export function habitatChips(habitat: string): string[] {
  return habitat
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/* --------------------------------------------------------------------- gear */

export interface GearParts {
  rod?: string;
  reel?: string;
  line?: string;
  /** Set when the string did not parse into three parts. */
  raw?: string;
}

/**
 * `Fish.gear` is a "rod • reel • main line" summary. Parse it when it has that
 * shape and fall back to showing it whole when it does not — the guide never
 * guesses at a value it was not given.
 */
export function parseGear(gear: string): GearParts {
  const parts = gear.split('•').map((s) => s.trim()).filter(Boolean);
  if (parts.length === 3) return { rod: parts[0], reel: parts[1], line: parts[2] };
  return { raw: gear };
}

/* --------------------------------------------------------------------- bait */

export interface BaitChoice {
  name: string;
  kind: 'natural' | 'artificial';
}

/**
 * `Fish.bait` is written as "natural, natural, natural; lure, lure" — the
 * semicolon separates live/natural baits from artificials. Split on that and
 * label each choice by what it is. We never invent a "when to use it" line the
 * data did not give us.
 */
export function parseBaits(bait: string): BaitChoice[] {
  const [natural, artificial] = bait.split(';');
  const split = (s: string | undefined, kind: BaitChoice['kind']): BaitChoice[] =>
    (s ?? '')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
      .map((name) => ({ name, kind }));

  return [...split(natural, 'natural'), ...split(artificial, 'artificial')];
}
