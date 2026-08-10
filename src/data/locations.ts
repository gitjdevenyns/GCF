import type {
  AccessType,
  Location,
  Region,
  TargetRecipe,
  TidePlaybook,
  TideStage,
  TideStationRef,
} from './types';

/**
 * Migrated from v6 window.SPOTS (data.js) — all 15 locations preserved.
 *
 * - Slugs are new, stable kebab-case identifiers (used in /locations/:slug).
 * - tide_playbook reproduces the v6 tidePlay() heuristic from supplement.js:
 *   stage text is derived from the location's structures, and the original
 *   one-line "tide" recommendation is kept as best_window.
 * - Tide stations: every location now has a verified NOAA CO-OPS station (see
 *   the station block below). This closes KNOWN_ISSUES.md #4 — Englewood,
 *   Placida and Boca Grande are no longer pending.
 * - seasons, access_notes, per-location images/sources and detailed recipe
 *   fields (rod/reel/presentation/cast_zone...) did not exist in v6 and are
 *   left empty — do not treat empty as "no fish here".
 *
 * `images` is empty for all fifteen spots and is expected to stay that way:
 * there is no licensed photograph of a minor local fishing spot that we can
 * verify actually shows that spot, and a mislabelled one would be worse than
 * none. Screens that need to show a place render a live Esri satellite map of
 * its coordinates instead (Home's "Go here now" card, LocationDetail's access
 * panel) — real, correct imagery of the actual water, with no provenance
 * problem. Do not re-point these slots at a stock photo.
 */

/**
 * NOAA CO-OPS tide stations.
 *
 * Every id below was verified against the CO-OPS metadata API
 * (`/mdapi/prod/webapi/stations/{id}.json`) — name, state and coordinates all
 * confirmed — and each one returns live high/low predictions. Each location is
 * assigned the nearest station on the same body of water, which matters more
 * than raw distance: a station across a barrier island can be an hour off.
 *
 * This mirrors `public.tide_stations` / `locations.tide_station_id` in Supabase,
 * so the bundled offline copy and the live snapshots agree on which station
 * backs which spot.
 */
const station = (noaa_id: string, label: string): TideStationRef => ({
  noaa_id,
  name: `NOAA ${label} ${noaa_id}`,
  url: `https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=${noaa_id}`,
});

/** Manatee River proper — the Green Bridge / Riverwalk stretch. */
const STATION_BRADENTON = station('8726247', 'Bradenton, Manatee River');
/** River mouth, immediately off Emerson Point / Snead Island. */
const STATION_DESOTO_POINT = station('8726273', 'Desoto Point');
const STATION_PALMA_SOLA_N = station('8726249', 'Palma Sola Bay North');
const STATION_PALMA_SOLA_S = station('8726233', 'Palma Sola Bay South');
/** Cortez / north Sarasota Bay, incl. Longboat Pass and the AMI bay side. */
const STATION_CORTEZ = station('8726217', 'Cortez');
const STATION_ANNA_MARIA = station('8726282', 'Anna Maria, City Pier');
const STATION_ENGLEWOOD = station('8725747', 'Englewood, Lemon Bay');
const STATION_PLACIDA = station('8725667', 'Placida, Gasparilla Sound');
/** The one reference (harmonic) station in the set; the rest are subordinate. */
const STATION_BOCA_GRANDE = station('8725577', 'Port Boca Grande, Charlotte Harbor');

/**
 * Port of the v6 tidePlay() structure heuristic (supplement.js):
 * grass/mangrove/oyster structures make the incoming tide a prime window;
 * drain/pass/channel/bridge/piling structures make the outgoing prime.
 */
function playbook(structures: string[], bestWindow: string): TidePlaybook {
  const st = structures.join(' ').toLowerCase();
  const incoming =
    st.includes('grass') || st.includes('mangrove') || st.includes('oyster');
  const outgoing =
    st.includes('drain') ||
    st.includes('pass') ||
    st.includes('channel') ||
    st.includes('bridge') ||
    st.includes('piling');
  const prime: TideStage[] = [];
  if (incoming) prime.push('incoming');
  if (outgoing) prime.push('outgoing');
  return {
    low: incoming
      ? 'Scout exposed structure, edges and potholes; fish remaining depth.'
      : 'Look for the deepest nearby channel/edge and visible current seams.',
    incoming: incoming
      ? 'Prime window: follow rising water toward grass, oyster edges and mangroves.'
      : 'Fish the up-current face, seam and any bait pushed through structure.',
    high: st.includes('mangrove')
      ? 'Work flooded roots, points and pockets; fish may spread out.'
      : 'Target shade, points, structure and bait concentrations.',
    outgoing: outgoing
      ? 'Prime window: intercept bait being pulled through the pass/channel/bridge zone.'
      : 'Back off to outer edges, drains, potholes and the first deeper water.',
    prime_stages: prime,
    best_window: bestWindow,
  };
}

/** Map a v6 target species label to a fish guide id (null = no guide entry yet). */
const SPECIES_IDS: Record<string, string> = {
  Snook: 'snook',
  Redfish: 'redfish',
  Trout: 'trout',
  Tarpon: 'tarpon',
  Snapper: 'snapper',
};

/** Conservative mapping of v6 free-text rig strings to rig ids. */
const RIG_IDS: Record<string, string> = {
  'free-line': 'free-line',
  'popping cork': 'popping-cork',
  knocker: 'knocker',
  'weedless paddletail': 'weedless-paddletail',
  weedless: 'weedless-paddletail',
  jig: 'jig-head',
};

interface RawTarget {
  species: string;
  rig: string;
  hook: string;
  leader: string;
  weight: string;
  bait: string;
}

function targets(raw: RawTarget[]): TargetRecipe[] {
  return raw.map((t, i) => ({
    species_id: SPECIES_IDS[t.species] ?? null,
    species_label: t.species,
    priority: i + 1,
    rig_id: RIG_IDS[t.rig] ?? null,
    rig: t.rig,
    hook: t.hook,
    leader: t.leader,
    weight: t.weight,
    bait: t.bait,
  }));
}

interface RawSpot {
  id: string;
  slug: string;
  name: string;
  region: Region;
  lat: number;
  lng: number;
  access: AccessType[];
  structures: string[];
  station: TideStationRef;
  tide: string;
  dayparts?: string[];
  targets: RawTarget[];
}

const RAW: RawSpot[] = [
  {
    id: 'emerson-point',
    slug: 'emerson-point',
    name: 'Emerson Point / Snead Island',
    region: 'Bradenton',
    lat: 27.5208,
    lng: -82.644,
    access: ['shore', 'kayak'],
    structures: ['grass', 'oyster', 'mangrove'],
    station: STATION_DESOTO_POINT,
    tide: 'Low incoming',
    targets: [
      { species: 'Redfish', rig: 'weedless paddletail', hook: '3/0–4/0', leader: '20–25 lb', weight: '1/16–1/8 oz', bait: 'shrimp/paddletail' },
      { species: 'Trout', rig: 'popping cork', hook: '1/0–2/0', leader: '15–20 lb', weight: 'light jig', bait: 'live shrimp' },
      { species: 'Snook', rig: 'free-line', hook: '2/0–4/0', leader: '30–40 lb', weight: 'none', bait: 'pilchard/pinfish' },
    ],
  },
  {
    id: 'palma-sola-bay',
    slug: 'palma-sola-bay',
    name: 'Palma Sola Bay',
    region: 'Bradenton',
    lat: 27.4962,
    lng: -82.6684,
    access: ['shore', 'wade'],
    structures: ['grass', 'potholes'],
    station: STATION_PALMA_SOLA_N,
    tide: 'Moving tide',
    targets: [
      { species: 'Trout', rig: 'popping cork', hook: '1/0–2/0', leader: '15–20 lb', weight: 'light', bait: 'shrimp' },
      { species: 'Redfish', rig: 'weedless paddletail', hook: '3/0–4/0', leader: '20–25 lb', weight: '1/16–1/8 oz', bait: 'paddletail' },
      { species: 'Snook', rig: 'free-line', hook: '2/0–4/0', leader: '30–40 lb', weight: 'none', bait: 'pilchard' },
    ],
  },
  {
    id: 'green-bridge',
    slug: 'green-bridge',
    name: 'Green Bridge',
    region: 'Bradenton',
    lat: 27.5003,
    lng: -82.5705,
    access: ['shore', 'pier'],
    structures: ['pilings', 'channel', 'lights'],
    station: STATION_BRADENTON,
    tide: 'Night moving tide',
    dayparts: ['night'],
    targets: [
      { species: 'Snook', rig: 'live bait', hook: '3/0–5/0', leader: '40–60 lb', weight: '0–1 oz', bait: 'pinfish/pilchard' },
      { species: 'Snapper', rig: 'knocker', hook: '1/0–2/0', leader: '20–30 lb', weight: '1/4–1 oz', bait: 'shrimp/pilchard' },
      { species: 'Sheepshead', rig: 'bottom rig', hook: '1/0', leader: '20–30 lb', weight: '1/4–1 oz', bait: 'shrimp/crab' },
    ],
  },
  {
    id: 'bradenton-riverwalk',
    slug: 'bradenton-riverwalk',
    name: 'Bradenton Riverwalk',
    region: 'Bradenton',
    lat: 27.4989,
    lng: -82.5688,
    access: ['shore'],
    structures: ['seawall', 'docks'],
    station: STATION_BRADENTON,
    tide: 'Moving tide',
    targets: [
      { species: 'Snook', rig: 'free-line', hook: '2/0–3/0', leader: '30 lb', weight: 'none', bait: 'shrimp/pilchard' },
      { species: 'Snapper', rig: 'knocker', hook: '1/0', leader: '20–25 lb', weight: '1/4–1/2 oz', bait: 'shrimp' },
      { species: 'Jack', rig: 'casting lure', hook: 'single hook', leader: '25–30 lb', weight: 'lure', bait: 'spoon/topwater' },
    ],
  },
  {
    id: 'bridge-street-pier',
    slug: 'bridge-street-pier',
    name: 'Bridge Street / Bradenton Beach',
    region: 'Anna Maria',
    lat: 27.4677,
    lng: -82.698,
    access: ['pier', 'shore'],
    structures: ['pilings', 'current'],
    station: STATION_CORTEZ,
    tide: 'Moving tide',
    targets: [
      { species: 'Snook', rig: 'live bait', hook: '3/0–5/0', leader: '40 lb', weight: 'light', bait: 'pilchard' },
      { species: 'Snapper', rig: 'knocker', hook: '1/0–2/0', leader: '20–30 lb', weight: '1/2 oz', bait: 'shrimp' },
      { species: 'Mackerel', rig: 'casting spoon', hook: 'single hook', leader: '30–40 lb bite leader', weight: '1/2–1 oz', bait: 'spoon' },
    ],
  },
  {
    id: 'longboat-pass',
    slug: 'longboat-pass',
    name: 'Longboat Pass',
    region: 'Anna Maria',
    lat: 27.4414,
    lng: -82.6916,
    access: ['shore', 'boat'],
    structures: ['deep pass', 'bridge'],
    station: STATION_CORTEZ,
    tide: 'Strong moving tide',
    targets: [
      { species: 'Snook', rig: 'live bait drift', hook: '4/0–5/0', leader: '40–60 lb', weight: '1/2–2 oz', bait: 'pinfish' },
      { species: 'Tarpon', rig: 'live crab', hook: '5/0–8/0', leader: '60–80 lb', weight: 'drift dependent', bait: 'crab/threadfin' },
      { species: 'Snapper', rig: 'knocker', hook: '2/0', leader: '30 lb', weight: '1/2–1 oz', bait: 'pilchard' },
    ],
  },
  {
    id: 'coquina-beach',
    slug: 'coquina-beach',
    name: 'Coquina Beach',
    region: 'Anna Maria',
    lat: 27.4438,
    lng: -82.691,
    access: ['shore'],
    structures: ['surf trough', 'pass edge'],
    station: STATION_CORTEZ,
    tide: 'Dawn/dusk',
    dayparts: ['dawn', 'dusk'],
    targets: [
      { species: 'Snook', rig: 'free-line/jig', hook: '2/0–4/0', leader: '30–40 lb', weight: '0–3/8 oz', bait: 'pilchard/paddletail' },
      { species: 'Pompano', rig: 'surf rig', hook: '1/0', leader: '15–20 lb', weight: '1–3 oz pyramid', bait: 'sand flea/shrimp' },
      { species: 'Mackerel', rig: 'spoon', hook: 'single hook', leader: '30–40 lb bite', weight: 'lure', bait: 'spoon' },
    ],
  },
  {
    id: 'bean-point',
    slug: 'bean-point',
    name: 'Bean Point',
    region: 'Anna Maria',
    lat: 27.5387,
    lng: -82.7443,
    access: ['shore'],
    structures: ['point', 'surf cuts'],
    station: STATION_ANNA_MARIA,
    tide: 'Moving water',
    targets: [
      { species: 'Snook', rig: 'live bait', hook: '3/0–5/0', leader: '30–40 lb', weight: 'light', bait: 'pilchard' },
      { species: 'Tarpon', rig: 'live crab', hook: '5/0–8/0', leader: '60–80 lb', weight: 'none', bait: 'crab' },
      { species: 'Pompano', rig: 'surf rig', hook: '1/0', leader: '15–20 lb', weight: '1–3 oz', bait: 'sand flea' },
    ],
  },
  {
    id: 'cortez-bridge',
    slug: 'cortez-bridge',
    name: 'Cortez Bridge',
    region: 'Bradenton',
    lat: 27.4669,
    lng: -82.6883,
    access: ['shore', 'bridge'],
    structures: ['bridge', 'docks'],
    station: STATION_CORTEZ,
    tide: 'Moving tide',
    targets: [
      { species: 'Snook', rig: 'live bait', hook: '3/0–5/0', leader: '40–50 lb', weight: '0–1 oz', bait: 'pinfish' },
      { species: 'Snapper', rig: 'knocker', hook: '1/0–2/0', leader: '20–30 lb', weight: '1/4–1 oz', bait: 'shrimp' },
      { species: 'Trout', rig: 'jig', hook: '1/8–1/4 oz jig', leader: '15–20 lb', weight: 'jig', bait: 'paddletail' },
    ],
  },
  {
    id: 'south-palma-sola-flats',
    slug: 'south-palma-sola-flats',
    name: 'South Palma Sola Flats',
    region: 'Bradenton',
    lat: 27.4798,
    lng: -82.6758,
    access: ['kayak', 'wade'],
    structures: ['grass', 'potholes'],
    station: STATION_PALMA_SOLA_S,
    tide: 'Low incoming',
    targets: [
      { species: 'Trout', rig: 'paddletail', hook: '1/8–1/4 oz jig', leader: '15–20 lb', weight: 'jig', bait: 'paddletail' },
      { species: 'Redfish', rig: 'weedless', hook: '3/0–4/0', leader: '20–25 lb', weight: '1/16–1/8 oz', bait: 'paddletail' },
      { species: 'Snook', rig: 'jerk shad', hook: '3/0–4/0', leader: '25–30 lb', weight: 'light', bait: 'jerk shad' },
    ],
  },
  {
    id: 'stump-pass',
    slug: 'stump-pass',
    name: 'Stump Pass',
    region: 'Englewood',
    lat: 26.9111,
    lng: -82.3529,
    access: ['shore', 'kayak'],
    structures: ['pass', 'surf', 'mangrove'],
    station: STATION_ENGLEWOOD,
    tide: 'Moving tide',
    targets: [
      { species: 'Snook', rig: 'live bait', hook: '3/0–5/0', leader: '30–40 lb', weight: '0–1/2 oz', bait: 'pilchard' },
      { species: 'Redfish', rig: 'shrimp/weedless', hook: '1/0–3/0', leader: '20–30 lb', weight: 'light', bait: 'shrimp' },
      { species: 'Tarpon', rig: 'live bait', hook: '5/0–8/0', leader: '60–80 lb', weight: 'drift', bait: 'crab/threadfin' },
    ],
  },
  {
    id: 'englewood-beach',
    slug: 'englewood-beach',
    name: 'Englewood Beach',
    region: 'Englewood',
    lat: 26.9258,
    lng: -82.3612,
    access: ['shore'],
    structures: ['surf trough', 'cuts'],
    station: STATION_ENGLEWOOD,
    tide: 'Dawn/dusk',
    dayparts: ['dawn', 'dusk'],
    targets: [
      { species: 'Snook', rig: 'free-line', hook: '2/0–4/0', leader: '30–40 lb', weight: 'none', bait: 'pilchard' },
      { species: 'Pompano', rig: 'surf rig', hook: '1/0', leader: '15–20 lb', weight: '1–3 oz', bait: 'sand flea' },
      { species: 'Mackerel', rig: 'spoon', hook: 'single hook', leader: '30–40 lb bite', weight: 'lure', bait: 'spoon' },
    ],
  },
  {
    id: 'lemon-bay-mangroves',
    slug: 'lemon-bay-mangroves',
    name: 'Lemon Bay Mangroves',
    region: 'Englewood',
    lat: 26.9562,
    lng: -82.3328,
    access: ['kayak', 'boat'],
    structures: ['points', 'grass', 'drains'],
    station: STATION_ENGLEWOOD,
    tide: 'High incoming/outgoing',
    targets: [
      { species: 'Redfish', rig: 'weedless', hook: '3/0–4/0', leader: '20–25 lb', weight: '1/16–1/8 oz', bait: 'paddletail' },
      { species: 'Snook', rig: 'live bait', hook: '2/0–4/0', leader: '30–40 lb', weight: 'light', bait: 'pilchard' },
      { species: 'Snapper', rig: 'free-line', hook: '1/0–2/0', leader: '20–25 lb', weight: 'none', bait: 'shrimp' },
    ],
  },
  {
    id: 'placida-gasparilla-sound',
    slug: 'placida-gasparilla-sound',
    name: 'Placida / Gasparilla Sound',
    region: 'Placida',
    lat: 26.833,
    lng: -82.2675,
    access: ['boat', 'kayak'],
    structures: ['mangrove', 'flats', 'docks'],
    station: STATION_PLACIDA,
    tide: 'Moving tide',
    targets: [
      { species: 'Redfish', rig: 'weedless', hook: '3/0–4/0', leader: '20–30 lb', weight: 'light', bait: 'paddletail' },
      { species: 'Snook', rig: 'live bait', hook: '3/0–5/0', leader: '30–50 lb', weight: 'none', bait: 'pilchard' },
      { species: 'Trout', rig: 'popping cork', hook: '1/0–2/0', leader: '15–20 lb', weight: 'light', bait: 'shrimp' },
    ],
  },
  {
    id: 'boca-grande-pass',
    slug: 'boca-grande-pass',
    name: 'Boca Grande Pass',
    region: 'Boca Grande',
    lat: 26.7208,
    lng: -82.2694,
    access: ['boat'],
    structures: ['major pass', 'deep current'],
    station: STATION_BOCA_GRANDE,
    tide: 'Seasonal / current',
    targets: [
      { species: 'Tarpon', rig: 'live crab drift', hook: '5/0–8/0', leader: '60–80 lb', weight: 'depth dependent', bait: 'crab/threadfin' },
      { species: 'Snook', rig: 'live bait', hook: '4/0–5/0', leader: '40–60 lb', weight: '1/2–2 oz', bait: 'pinfish' },
      { species: 'Jack', rig: 'heavy lure', hook: 'single hook', leader: '40–60 lb', weight: 'lure', bait: 'plug/jig' },
    ],
  },
];

export const LOCATIONS: Location[] = RAW.map((s) => ({
  id: s.id,
  slug: s.slug,
  name: s.name,
  region: s.region,
  lat: s.lat,
  lng: s.lng,
  access: s.access,
  structures: s.structures,
  tide_station: s.station,
  seasons: [],
  dayparts: s.dayparts ?? [],
  tide_playbook: playbook(s.structures, s.tide),
  targets: targets(s.targets),
  images: [],
  safety: [],
  access_notes: [],
  sources: [],
}));

export const locationBySlug = (slug: string): Location | undefined =>
  LOCATIONS.find((l) => l.slug === slug);

export const REGIONS: Region[] = [
  'Bradenton',
  'Anna Maria',
  'Englewood',
  'Placida',
  'Boca Grande',
];

export const ACCESS_TYPES: AccessType[] = [
  'shore',
  'kayak',
  'boat',
  'pier',
  'wade',
  'bridge',
];
