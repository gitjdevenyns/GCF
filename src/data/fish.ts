import type { Fish } from './types';

/**
 * Migrated from v6 window.FISH (data.js) + window.HANDLING (supplement.js).
 * Image URLs are the original v6 hotlinks; provenance/local-asset migration
 * is tracked separately.
 */

/**
 * v6 carried one shared landing-tool string for every species, and it ended
 * with a tarpon-specific clause — which read as a non-sequitur on a redfish or
 * snapper page. Same guidance, scoped to the species it is actually about.
 */
const NET_NOTE = 'Knotless rubber-coated net, sized for the target.';

/** Adult tarpon are too large to net or boat safely, for fish or angler. */
const TARPON_NOTE =
  'No net and no boating an adult — keep the fish alongside in the water and support it there for the release.';

export const FISH: Fish[] = [
  {
    id: 'snook',
    name: 'Common Snook',
    images: [
      {
        url: 'https://www.floridamuseum.ufl.edu/wp-content/uploads/sites/66/2017/05/Centropomus-undecimalis-01.jpg',
        alt: 'Common snook identification photo',
      },
      {
        url: 'https://www.anglersbooking.com/blog/articles/boca-grande-fishing/images/underwater-snook-fish.webp',
        alt: 'Snook underwater near structure',
      },
    ],
    habitat: 'Mangroves, beaches, passes, docks, bridge shadow lines',
    gear: "7–7'6 MH • 4000–5000 • 20–30 lb braid",
    leader: '30–40 lb fluoro; 40–60 at pilings',
    hook: '2/0–5/0 inline circle',
    bait: 'Pilchard, pinfish, mullet, shrimp; paddletail/jerk shad',
    landing_tool: NET_NOTE,
    handling: {
      dos: [
        'Leave it in the water while dehooking when possible',
        'Wet hands before touching',
        'Support horizontally for a quick photo',
        'Use adequate tackle so the fight is not prolonged',
      ],
      donts: [
        'Do not grab the gill plate—FWC warns the gill covers are razor sharp',
        'Do not put fingers in gills or eyes',
        'Do not drag large fish onto dry sand or deck',
      ],
      angler:
        'Razor-sharp gill covers. Control the head and keep fingers behind/away from the gill plate.',
    },
  },
  {
    id: 'redfish',
    name: 'Redfish / Red Drum',
    images: [
      {
        url: 'https://www.floridamuseum.ufl.edu/wp-content/uploads/sites/66/2017/05/Sciaenops-ocellatus-01.jpg',
        alt: 'Redfish identification photo',
      },
      {
        // The v6 hotlink (fishingweather.app) now answers 403 to every request,
        // browser user-agent and referer included, so this hero rendered blank.
        // Replaced with a verified public-domain USFWS photograph.
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Red_Drum_Fish.jpg/1280px-Red_Drum_Fish.jpg',
        alt: 'Red drum held horizontally over marsh water: coppery bronze back, white belly and the black spot at the base of the tail',
        source_url: 'https://commons.wikimedia.org/wiki/File:Red_Drum_Fish.jpg',
        license:
          'Public domain (Steve Hillebrand, U.S. Fish and Wildlife Service, via Wikimedia Commons)',
      },
    ],
    habitat: 'Oyster edges, grass, potholes, drains',
    gear: "7–7'6 M • 3000–4000 • 15–20 lb braid",
    leader: '20–30 lb fluoro',
    hook: '1/0–3/0 circle or 3/0–4/0 weedless',
    bait: 'Shrimp, pinfish, cut mullet; gold spoon/paddletail',
    landing_tool: NET_NOTE,
    handling: {
      dos: [
        'Wet hands',
        'Use a knotless rubber net',
        'Support belly and tail horizontally',
        'Release head-first',
      ],
      donts: [
        'Do not hang vertically by the jaw',
        'Do not scrape across oyster shell or dry surfaces',
        'Do not squeeze the abdomen',
      ],
      angler:
        'Generally manageable, but dorsal fin rays/spines and hooks are the main handling hazards.',
    },
  },
  {
    id: 'trout',
    name: 'Spotted Seatrout',
    images: [
      {
        url: 'https://www.floridamuseum.ufl.edu/wp-content/uploads/sites/66/2017/05/Cynoscion-nebulosus-01.jpg',
        alt: 'Spotted seatrout identification photo',
      },
      {
        url: 'https://www.louisianasportsman.com/wp-content/uploads/2023/08/Eel-Grass-pic2.jpg',
        alt: 'Seatrout over grass',
      },
    ],
    habitat: 'Grass flats, sandy potholes, channel edges',
    gear: "7–7'6 M • 2500–3000 • 10–15 lb braid",
    leader: '15–20 lb fluoro',
    hook: '1/0–2/0 circle or 1/8–1/4 oz jig',
    bait: 'Live shrimp under cork; 3–4 in paddletail',
    landing_tool: NET_NOTE,
    handling: {
      dos: [
        'Keep handling exceptionally brief',
        'Use wet hands and rubber net',
        'Support horizontally',
        'Dehook in water when possible',
      ],
      donts: [
        'Do not squeeze—trout are delicate',
        'Do not lift by leader',
        'Keep fingers away from mouth',
      ],
      angler:
        'Large canine teeth at the front of the upper jaw; dorsal spines can also prick hands.',
    },
  },
  {
    id: 'tarpon',
    name: 'Tarpon',
    images: [
      {
        url: 'https://www.floridamuseum.ufl.edu/wp-content/uploads/sites/66/2017/05/Megalops-atlanticus-01.jpg',
        alt: 'Tarpon identification photo',
      },
      {
        url: 'https://www.saltyjawcharters.com/uploads/9/2/6/0/92607848/img-4612_orig.jpeg',
        alt: 'Tarpon boatside',
      },
    ],
    habitat: 'Passes, beaches, bridges, harbor mouths',
    gear: "7'6–8 H • 6000–8000 • 40–50 lb braid",
    leader: '60–80 lb leader',
    hook: '5/0–8/0 strong inline circle',
    bait: 'Pass crab, threadfin, pilchard, mullet',
    landing_tool: TARPON_NOTE,
    handling: {
      dos: [
        'For fish over 40 inches, keep it in the water',
        'Use a long dehooker or cut leader close',
        'Keep gills submerged',
        'Use tackle heavy enough to shorten the fight',
      ],
      donts: [
        'Do not boat or drag large tarpon over a gunwale',
        'Do not hold by gills/eyes',
        'Do not prolong photos',
      ],
      angler:
        'Large fish can thrash violently; mouth is abrasive and hooks are a major hazard. Control from alongside the boat.',
    },
  },
  {
    id: 'snapper',
    name: 'Mangrove / Gray Snapper',
    images: [
      {
        url: 'https://www.floridamuseum.ufl.edu/wp-content/uploads/sites/66/2017/05/Lutjanus-griseus-01.jpg',
        alt: 'Mangrove snapper identification photo',
      },
      {
        url: 'https://www.anglersbooking.com/blog/articles/tampa-bay-fishing/images/mangrove-snapper-group-mangrove-roots-florida.webp',
        alt: 'Mangrove snapper around mangrove roots',
      },
    ],
    habitat: 'Mangroves, docks, bridge pilings, rock',
    gear: '7 M • 3000–4000 • 15–20 lb braid',
    leader: '20–30 lb fluoro',
    hook: '1/0–2/0 circle',
    bait: 'Shrimp, pilchard, pinfish, cut bait',
    landing_tool: NET_NOTE,
    handling: {
      dos: [
        'Wet hands',
        'Use rubber net',
        'Support body',
        'Use pliers for hook removal',
      ],
      donts: [
        'Do not put fingers in mouth',
        'Do not hold only by jaw for extended periods',
        'Do not let it flop on hot/dry deck',
      ],
      angler:
        'Two prominent canine teeth; dorsal spines can prick. Use pliers and keep fingers clear of mouth.',
    },
  },
];

export const fishById = (id: string): Fish | undefined =>
  FISH.find((f) => f.id === id);
