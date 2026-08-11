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
 * Mark placement: `left` / `top` are percentages of the PHOTOGRAPH, and they
 * are the position of the anatomical feature itself — nothing else. They are no
 * longer constrained to the top of the plate and they are not the position of
 * the numbered label: the label is projected out into the plate's gutter by
 * `idPlateGeometry.placeMarks`, which also keeps labels from colliding, and a
 * leader line runs from the label back to this exact point. Move one of these
 * numbers only to correct where the feature is on that photo.
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
    // Placed against the FDA Regulatory Fish Encyclopedia plate in
    // `src/data/fish.ts` — a left-facing specimen, head at the left edge, cut
    // to exactly the 3:2 the photo box renders, so these percentages are the
    // literal percentages of that file with no `object-fit` crop in between.
    // Each one was read off the image itself, not estimated: mark 1 sits on the
    // pair of long white canines at the front of the open upper jaw, mark 2 on
    // bare flank directly under the front of the soft dorsal (exactly where a
    // lane snapper carries its spot), mark 3 on the straight run of snout
    // between the mouth and the eye, mark 4 in the rust-red anal fin.
    // The previous numbers were calibrated against a school photo and pointed
    // at open water and coral branches.
    marks: [
      mark(
        1,
        '2.4%',
        '56.8%',
        'Two prominent canine teeth in the upper jaw',
        'A pair of obvious fangs at the front of the top jaw, visible with the mouth barely open. Keep fingers clear and use pliers.',
        'decisive',
      ),
      mark(
        2,
        '61%',
        '47%',
        'No dark spot on the flank',
        'A clean side. A dark spot high on the flank below the soft dorsal means lane snapper, not mangrove.',
        'decisive',
      ),
      mark(
        3,
        '6%',
        '49.5%',
        'Pointed snout, straight sloping head',
        'The head runs down to the mouth in an almost straight line — a wedge rather than a curve.',
        'supporting',
      ),
      mark(
        4,
        '71%',
        '68%',
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

  /* Six species added after the original five. Same rules: every mark is a
     visible feature published in the FWC and Florida Museum species profiles,
     nothing here is or implies a regulation, and marks are placed for the
     left-facing lateral photograph on each entry in src/data/fish.ts. */

  sheepshead: {
    tags: ['Structure feeder', 'Bites like a thief'],
    lede:
      'Sheepshead live on hard vertical structure and eat what is growing on it — barnacles, oysters, small crabs. They are not chasing your bait across open water; they are three inches off a piling, and if the bait is not there either, neither are they.',
    idLede: 'The teeth end the argument. The bars get you there from a distance.',
    marks: [
      mark(
        1,
        '17%',
        '58%',
        'Human-like incisors at the front of the jaw',
        'Broad flat front teeth, then molars and grinders behind them, all built to crush shell. Nothing else you will catch inshore has a mouth like this.',
        'decisive',
      ),
      mark(
        2,
        '50%',
        '44%',
        'Five or six dark vertical bars',
        'Bold black bars down a pale body — the reason for the "convict fish" nickname. Sharpest on young fish and can wash out on big ones.',
        'decisive',
      ),
      mark(
        3,
        '66%',
        '28%',
        'Row of stout, sharp dorsal spines',
        'Short, thick spines along the front of the dorsal fin that stand up when the fish flexes. Note them while identifying, because they are also what gets you.',
        'supporting',
      ),
      mark(
        4,
        '26%',
        '40%',
        'Blunt snout, small horizontal mouth',
        'The head runs down to a short, squared-off snout with a small mouth set level — a shell-picker, not a fish-chaser.',
        'supporting',
      ),
    ],
    confusables: [
      {
        name: 'Atlantic spadefish',
        tell: 'Also barred, also around pilings. Spadefish are round as a plate with a long trailing dorsal lobe, and they have small brush-like teeth rather than incisors.',
      },
      {
        name: 'Black drum (young)',
        tell: 'Young black drum carry vertical bars too. Look under the chin: black drum have barbels there and no front teeth. Sheepshead have teeth and a clean chin.',
      },
    ],
  },

  ladyfish: {
    tags: ['Best first fish', 'Handle fast, release fast'],
    lede:
      'If you have never caught a saltwater fish from shore, this is the one to go and get. Ladyfish hunt in packs in moving water — a lit bridge, a pass on the fall, a beach trough at dusk — and they hit a small jig hard, jump repeatedly, and are usually willing when nothing else is. Find bait spraying at the surface and cast into the edge of it.',
    idLede: 'A slim silver rocket that jumps. Check two things and you are done.',
    marks: [
      mark(
        1,
        '55%',
        '30%',
        'One small dorsal fin, set well back, with no trailing filament',
        'A single short dorsal about halfway down the back. If a whip-like ray trails off the back of it, you have a tarpon, not a ladyfish.',
        'decisive',
      ),
      mark(
        2,
        '11%',
        '42%',
        'Small pointed head, large eye, mouth at the very tip',
        'The mouth is terminal — it points straight forward, not up. Tarpon look up at you; ladyfish look at you.',
        'decisive',
      ),
      mark(
        3,
        '38%',
        '48%',
        'Slender body in fine silver scales',
        'Long and round-sectioned, in small bright scales. Tarpon scales are coin-sized plates; these you cannot count.',
        'supporting',
      ),
      mark(
        4,
        '86%',
        '38%',
        'Deeply forked tail',
        'A big, deeply forked tail on a thin body — the reason it goes airborne the moment it feels the hook.',
        'supporting',
      ),
    ],
    confusables: [
      {
        name: 'Juvenile tarpon',
        tell: 'Same silver, same places, and both jump. Tarpon have the long trailing filament off the dorsal fin, an upturned lower jaw and huge plate-like scales.',
      },
      {
        name: 'Bonefish',
        tell: 'Also slim and silver, but the mouth sits underneath a blunt, over-hanging snout, and bonefish are on shallow sand, not in a bridge light.',
      },
    ],
  },

  'black-drum': {
    tags: ['Bottom feeder', 'Shares redfish ground'],
    lede:
      'Black drum work the same edges redfish do — oyster bars, dock and bridge pilings, the deeper holes beside a pass — with their heads down, feeling for shellfish with the barbels under the chin. They are slower and less flashy than a redfish, and they want a bait sitting still on the bottom rather than one swimming past.',
    idLede: 'Look under the chin first. That is the whole identification.',
    marks: [
      mark(
        1,
        '12%',
        '60%',
        'Barbels under the chin',
        'A fringe of short whiskers under the lower jaw, used to find shellfish by touch. Redfish and sheepshead have nothing there. This alone settles it.',
        'decisive',
      ),
      mark(
        2,
        '80%',
        '52%',
        'No black spot at the base of the tail',
        'A clean tail wrist. A dark eye-spot there means red drum. Check it second, right after the chin.',
        'decisive',
      ),
      mark(
        3,
        '35%',
        '30%',
        'High, arched grey-black back',
        'The back humps up steeply behind the head — a taller, more hunched profile than a redfish of the same length.',
        'supporting',
      ),
      mark(
        4,
        '55%',
        '44%',
        'Vertical bars on young fish',
        'Four to six dark bars down the sides of a small drum. They fade with age, so their absence on a big fish means nothing.',
        'supporting',
      ),
    ],
    confusables: [
      {
        name: 'Redfish / red drum',
        tell: 'Same shape, same oyster bar, same bait. Redfish have a black spot at the tail base and a clean chin; black drum have barbels and no spot.',
      },
      {
        name: 'Sheepshead',
        tell: 'Young black drum and sheepshead are both barred. Sheepshead have protruding incisors and no barbels; black drum have barbels and no visible teeth.',
      },
    ],
  },

  pompano: {
    tags: ['Surf species', 'Light tackle'],
    lede:
      'Pompano are a beach fish. They run the trough between the sand and the first bar, nose-down over moving sand, digging out sand fleas as the wave sucks back. Fish the trough and the cuts through the bar — that band of water, not the flat sand beyond it, is where they feed.',
    idLede: 'Small mouth, deep body, forked tail. Then check the fins.',
    marks: [
      mark(
        1,
        '11%',
        '50%',
        'Gently sloping forehead over a very small mouth',
        'A short, blunt head running down to a small mouth with no visible teeth — built to root shellfish out of sand.',
        'decisive',
      ),
      mark(
        2,
        '55%',
        '22%',
        'Dorsal fin starts ahead of the anal fin',
        'This is what separates pompano from permit: on a pompano the dorsal fin begins in front of the anal fin rather than directly over it.',
        'decisive',
      ),
      mark(
        3,
        '48%',
        '58%',
        'Yellow wash on the throat and belly',
        'Silver flanks over a yellow-tinged underside, strongest on fish out of darker water. A good hint, never the deciding tell.',
        'supporting',
      ),
      mark(
        4,
        '89%',
        '40%',
        'Deep compressed body, deeply forked tail',
        'A flat, deep, pan-shaped body on a fish that swims hard for its size — which is why light tackle is more fun and heavy tackle is a waste.',
        'supporting',
      ),
    ],
    confusables: [
      {
        name: 'Permit',
        tell: 'The same silhouette but grows far larger, and its dorsal fin sits directly over the anal fin instead of ahead of it.',
      },
      {
        name: 'Lookdown / Atlantic moonfish',
        tell: 'Also flat and silver in the surf, but with an almost vertical face and a very high forehead. No yellow underside.',
      },
    ],
  },

  'spanish-mackerel': {
    tags: ['Fast, schooling', 'Teeth — use a tool'],
    lede:
      'Spanish mackerel come through in schools, high in the water, herding glass minnows and pilchards against a pass mouth, a pier front or a bar. When they show, it is a fast bite and a short window: something small, shiny and moving quickly, cast at the edge of the bait rather than into the middle of it.',
    idLede: 'Two marks separate it from the king mackerel it grows up beside.',
    marks: [
      mark(
        1,
        '45%',
        '46%',
        'Round golden-yellow spots, no bars',
        'Three or so rows of round brassy-gold spots scattered on a plain silver flank. King mackerel adults have no spots; juveniles have smaller, fainter ones.',
        'decisive',
      ),
      mark(
        2,
        '27%',
        '32%',
        'Dark blotch on the front dorsal fin',
        'A bluish-black patch on the first dorsal fin. King mackerel do not have it. This is the mark to check when the spots are ambiguous.',
        'decisive',
      ),
      mark(
        3,
        '68%',
        '52%',
        'Lateral line slopes gently to the tail',
        'The line runs down in a smooth curve. On a king mackerel it drops sharply below the second dorsal fin.',
        'supporting',
      ),
      mark(
        4,
        '8%',
        '54%',
        'Single row of triangular teeth',
        'Big flat triangular teeth in one row. You will see them before you touch them — and that is the point of noticing.',
        'supporting',
      ),
    ],
    confusables: [
      {
        name: 'King mackerel',
        tell: 'No dark blotch on the front dorsal fin, and a lateral line that drops abruptly under the second dorsal. Small kings are the usual mix-up at a pier.',
      },
      {
        name: 'Cero mackerel',
        tell: 'Carries yellow-brown streaks and dashes along the flank as well as spots. Spanish mackerel have spots only.',
      },
    ],
  },

  'jack-crevalle': {
    tags: ['Hits hard', 'Bycatch worth knowing'],
    lede:
      'Jacks travel and hunt as a pack, pushing bait against a pass edge, a bridge or a seawall, and they announce themselves — bait showering, a boil, then a bite that feels like the rod got hit by something much larger. You rarely go looking for them. You do want to recognise one before you reach for it.',
    idLede: 'Two black spots. Check the gill cover, then the pectoral fin.',
    marks: [
      mark(
        1,
        '22%',
        '38%',
        'Black spot on the gill cover',
        'A distinct dark blotch high on the rear edge of the gill cover. Blue runner, the usual look-alike, does not have the pair of spots.',
        'decisive',
      ),
      mark(
        2,
        '31%',
        '50%',
        'Black spot at the base of the pectoral fin',
        'A second oval black spot where the pectoral fin joins the body. Gill cover plus pectoral together settle it.',
        'decisive',
      ),
      mark(
        3,
        '10%',
        '28%',
        'Steep, blunt forehead',
        'The head rises almost vertically from the mouth — a deep, bluff-fronted profile no other inshore jack has quite so exaggerated.',
        'supporting',
      ),
      mark(
        4,
        '76%',
        '42%',
        'Hard scutes along the tail wrist',
        'A keel of hard bony plates running to the tail. This is the part that cuts, so identify it now and pick the fish up somewhere else.',
        'supporting',
      ),
    ],
    confusables: [
      {
        name: 'Blue runner',
        tell: 'Slimmer, more streamlined, and lacks the crevalle jack pairing of a gill-cover spot with a pectoral-base spot.',
      },
      {
        name: 'Horse-eye jack',
        tell: 'Much bigger eye, a slimmer body and a yellow tail. It has no black spot at the base of the pectoral fin.',
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

/* ----------------------------------------------------------------- bait art */

/**
 * The illustration to draw for a bait choice.
 *
 * These are *categories*, not products. The `bait` field is free text written
 * for anglers ("3–4 in paddletail", "paddletail/jerk shad", "weedless
 * paddletail"), so an icon per literal string is neither possible nor useful —
 * all three of those are one soft plastic. `natural` and `artificial` are the
 * last-resort fallbacks: a shape that is honestly generic, never a blank box.
 */
export type BaitIcon =
  | 'shrimp'
  | 'crustacean'
  | 'baitfish'
  | 'cutbait'
  | 'softplastic'
  | 'jig'
  | 'spoon'
  | 'plug'
  | 'natural'
  | 'artificial';

/**
 * Keyword table, most specific rule first.
 *
 * Order only breaks ties: matching is by *position in the string*, so a
 * compound choice is drawn as whatever leads it — "gold spoon/paddletail" is a
 * spoon, "paddletail/jerk shad" is a soft plastic, "cut mullet" is cut bait
 * rather than a live mullet. That mirrors how the line is read out loud: the
 * first thing named is the thing being recommended.
 */
const BAIT_KEYWORDS: ReadonlyArray<readonly [BaitIcon, readonly string[]]> = [
  // Before `baitfish` and `crustacean`: "cut mullet" and "dead shrimp" are not
  // live baits, and the word that makes them so comes first in both.
  ['cutbait', ['cut ', 'cut bait', 'cutbait', 'chunk', 'dead ', 'strip bait', 'fillet', 'ladyfish chunk']],
  ['shrimp', ['shrimp', 'prawn']],
  ['crustacean', [
    'crab', 'sand flea', 'mole crab', 'fiddler', 'shedder', 'crustacean', 'barnacle', 'clam',
  ]],
  ['baitfish', [
    'pilchard', 'pinfish', 'mullet', 'threadfin', 'sardine', 'greenback', 'scaled sardine',
    'blue runner', 'runner', 'ballyhoo', 'mojarra', 'croaker', 'grunt', 'herring', 'minnow',
    'finger mullet', 'whitebait', 'baitfish',
  ]],
  // Lure hardware before the plastics that hang off it only where the hardware
  // is what the angler actually buys ("white jig", "plug/jig").
  ['spoon', ['spoon']],
  ['softplastic', [
    'paddletail', 'paddle tail', 'jerk shad', 'shad', 'swimbait', 'soft plastic', 'softbait',
    'gulp', 'curly tail', 'grub',
  ]],
  ['jig', ['jig', 'bucktail']],
  ['plug', [
    'plug', 'topwater', 'walk the dog', 'popper', 'crankbait', 'jerkbait', 'twitch bait',
    'hard bait', 'hardbait', 'lipped',
  ]],
];

/**
 * Pick the illustration for one parsed bait choice.
 *
 * Never returns "nothing": an unrecognised name falls back to the generic
 * natural-bait or artificial-lure shape according to which side of the
 * semicolon it came from. That is honest here in a way it would not be for an
 * identification photo — this is a card decoration next to the name in text,
 * not a claim about which animal you are looking at.
 */
export function baitIcon(name: string, kind: BaitChoice['kind']): BaitIcon {
  const s = name.toLowerCase();
  let best: { icon: BaitIcon; at: number } | null = null;

  for (const [icon, words] of BAIT_KEYWORDS) {
    let at = -1;
    for (const w of words) {
      const i = s.indexOf(w);
      if (i >= 0 && (at < 0 || i < at)) at = i;
    }
    if (at >= 0 && (best === null || at < best.at)) best = { icon, at };
  }

  return best?.icon ?? kind;
}
