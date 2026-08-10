import type {
  AccessType,
  Location,
  Region,
  SourceRef,
  TargetRecipe,
  TidePlaybook,
  TideStage,
  TideStationRef,
} from './types';

/**
 * The 15 original locations were migrated from v6 window.SPOTS (data.js); the
 * 10 Tampa Bay / Sarasota spots below them were researched fresh.
 *
 * - Slugs are new, stable kebab-case identifiers (used in /locations/:slug).
 * - tide_playbook reproduces the v6 tidePlay() heuristic from supplement.js:
 *   stage text is derived from the location's structures, and the original
 *   one-line "tide" recommendation is kept as best_window. The newer spots use
 *   the same helper so every page reads the same way.
 * - Tide stations: every location has a verified NOAA CO-OPS station (see the
 *   station block below). This closes KNOWN_ISSUES.md #4 — Englewood, Placida
 *   and Boca Grande are no longer pending.
 * - seasons, access_notes, safety and sources did not exist in v6, so the
 *   original 15 still have them empty — do not treat empty as "no fish here"
 *   or "no hazard here". The 10 newer spots fill them in from the sources
 *   cited on each entry; anything that could not be sourced was left empty
 *   rather than guessed.
 *
 * `images` is empty for all 25 spots and is expected to stay that way: there
 * is no licensed photograph of a minor local fishing spot that we can verify
 * actually shows that spot, and a mislabelled one would be worse than none.
 * Screens that need to show a place render a live Esri satellite map of its
 * coordinates instead (Home's "Go here now" card, LocationDetail's hero band
 * and access panel) — real, correct imagery of the actual water, with no
 * provenance problem. Do not re-point these slots at a stock photo.
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

/*
 * Tampa Bay and Sarasota Bay stations, added with the northern expansion.
 *
 * Same-body-of-water assignment matters even more up here than it does around
 * Anna Maria, because the tide takes well over an hour to travel from the bay
 * mouth to the top of the bay. Predicted highs for one sample day, south to
 * north: Egmont Key 10:11, Mullet Key 10:23, Tierra Verde 10:39,
 * Point Pinellas 11:37, St. Petersburg 11:59, Gandy Bridge (Old Tampa Bay)
 * 12:58. Picking "the nearest dot on the map" across a basin boundary is
 * therefore worth roughly an hour of error, so each spot below is matched to
 * the water it actually sits on.
 */
/** Big Sarasota Pass — the pass South Lido fishes. */
const STATION_BIG_SARASOTA_PASS = station('8726034', 'Siesta Key, Big Sarasota Pass');
/** South Longboat Key, Sarasota Bay — the water either side of New Pass. */
const STATION_LONGBOAT_KEY = station('8726089', 'Longboat Key, Sarasota Bay');
/** Egmont Channel, the deep Gulf entrance to Tampa Bay. */
const STATION_EGMONT_KEY = station('8726347', 'Egmont Key, Tampa Bay');
/** Mullet Key Channel at the Skyway — open lower-bay water. */
const STATION_MULLET_KEY = station('8726364', 'Mullet Key, Tampa Bay');
/** Bunces Pass / Pass-a-Grille Channel system behind the barrier islands. */
const STATION_TIERRA_VERDE = station('8726428', 'Tierra Verde');
/** Harmonic reference station on the downtown St. Pete waterfront. */
const STATION_ST_PETERSBURG = station('8726520', 'St. Petersburg, Tampa Bay');

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
  /**
   * Researched fields. The v6 spots have none of these; omit them rather than
   * writing a plausible-sounding string, because the location page renders
   * "not documented yet" honestly and that is the correct answer for anything
   * nobody has actually checked.
   */
  seasons?: string[];
  accessNotes?: string[];
  safety?: string[];
  sources?: SourceRef[];
}

/**
 * Per-pier entry in FWC's Boating and Angling Guide to Tampa Bay — the most
 * authoritative public record of what each pier is, what it has on it, and
 * whether it charges.
 */
const fwcPier = (path: string, label: string): SourceRef => ({
  id: 'fwc-pier',
  label,
  url: `https://gis.myfwc.com/boating_guides/Tampa_Bay/pages/fishing_piers/${path}/index.html`,
  publisher: 'FWC — Boating and Angling Guide to Tampa Bay',
});

/** The NOAA CO-OPS station page the spot's predictions actually come from. */
const noaaSource = (st: TideStationRef, note?: string): SourceRef => ({
  id: 'noaa-station',
  label: `${st.name} — tide predictions`,
  url: st.url as string,
  publisher: 'NOAA Tides & Currents',
  note,
});

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

  /* ------------------------------------------------------------------ *
   * Northern expansion: Sarasota Bay, the Skyway, Fort De Soto and the
   * St. Petersburg / Pinellas shoreline. Every spot below is a named,
   * publicly accessible place with a government or park-authority source
   * on the entry; coordinates come from OpenStreetMap features or the
   * cited park page, not from a guess at where the fish are.
   * ------------------------------------------------------------------ */

  {
    id: 'weedon-island',
    slug: 'weedon-island',
    name: 'Weedon Island Preserve',
    region: 'St. Petersburg',
    lat: 27.8438,
    lng: -82.6113,
    access: ['pier', 'kayak', 'shore'],
    structures: ['mangrove', 'oyster', 'grass', 'drains'],
    // Bay-facing Pinellas shoreline at the mouth of Old Tampa Bay. The Gandy
    // Bridge station is closer in a straight line but sits inside Old Tampa
    // Bay, which runs about an hour behind the main bay — wrong basin.
    station: STATION_ST_PETERSBURG,
    tide: 'Low incoming',
    dayparts: ['dawn', 'dusk'],
    targets: [
      { species: 'Trout', rig: 'popping cork', hook: '1/0–2/0', leader: '15–20 lb', weight: 'light jig', bait: 'live shrimp' },
      { species: 'Snook', rig: 'weedless paddletail', hook: '3/0–4/0', leader: '30–40 lb', weight: '1/16–1/8 oz', bait: 'paddletail/pilchard' },
      { species: 'Sheepshead', rig: 'bottom rig', hook: '1/0 short shank', leader: '20 lb fluoro', weight: '1/4–1/2 oz', bait: 'live shrimp/fiddler crab' },
    ],
    seasons: [
      'Dec–Mar sheepshead on the pier and bars',
      'Apr–Oct snook along the mangrove edges',
      'Trout on the grass most of the year',
    ],
    accessNotes: [
      'Pinellas County preserve, open daily from 7 am to dusk; admission is free.',
      'The fishing pier and the canoe/kayak launch are both at the end of Weedon Drive NE, off San Martin Blvd.',
      'Two self-guided paddling trails leave from the launch; the county lists the north trail as closed, so check the sign before you plan a loop.',
      'Restrooms on site, but no bait shop and no fish-cleaning table — buy bait before you drive in.',
    ],
    safety: [
      'The oyster bars off the pier are live shell. Hard-soled boots if you get out of the boat, and keep braid off the bar.',
      'The mangrove tunnels on the paddling trail are easy to enter on a high tide and hard to get back out of on a falling one — start the loop with water to spare.',
    ],
    sources: [
      {
        id: 'pinellas-weedon',
        label: 'Weedon Island Preserve — hours, pier, paddling trails',
        url: 'https://pinellas.gov/parks/weedon-island-preserve/',
        publisher: 'Pinellas County Parks & Conservation Resources',
        note: 'Source for the target species listed here: the county names sea trout, snook and sheepshead off the pier and outlying oyster bars.',
      },
      fwcPier('weedon_island', 'Weedon Island fishing pier — facilities and hours'),
      noaaSource(
        STATION_ST_PETERSBURG,
        'Assigned on same-basin logic: Weedon Island faces Tampa Bay proper. Old Tampa Bay stations north of the Gandy causeway run roughly an hour later and should not be used here.',
      ),
    ],
  },
  {
    id: 'st-pete-pier',
    slug: 'st-pete-pier',
    name: 'St. Pete Pier',
    region: 'St. Petersburg',
    lat: 27.7737,
    lng: -82.6228,
    access: ['pier', 'shore'],
    structures: ['pier pilings', 'seawall', 'lights'],
    station: STATION_ST_PETERSBURG,
    tide: 'Moving tide',
    dayparts: ['dusk', 'night'],
    targets: [
      { species: 'Sheepshead', rig: 'bottom rig', hook: '1/0 short shank', leader: '20 lb fluoro', weight: '1/4–1 oz', bait: 'live shrimp/fiddler crab' },
      { species: 'Snapper', rig: 'knocker', hook: '1/0–2/0', leader: '20–30 lb', weight: '1/4–1/2 oz', bait: 'live shrimp/pilchard' },
      { species: 'Jack', rig: 'casting lure', hook: 'single hook', leader: '30–40 lb', weight: 'lure', bait: 'spoon/topwater' },
    ],
    seasons: [
      'Dec–Mar sheepshead on the pilings',
      'Jun–Sep mangrove snapper after dark',
      'Spanish mackerel and jacks on bait pushes spring and fall',
    ],
    accessNotes: [
      'Fishing is allowed only on the designated Fishing Deck east of the Pier Point building — not from the approach or the rest of the pier.',
      'Posted fishing hours run from about 30 minutes before sunrise to 11 pm daily; the pier changes them, so check its site before a night session.',
      'Walking on is free; parking in the pier district lots is paid. Bait and tackle are sold on site.',
      'Fish-cleaning table and fresh water on the deck; no bait shop is listed in FWC’s entry, so hours can vary.',
    ],
    safety: [
      'The deck sits high over the water. Bring or borrow a drop net — hauling a fish up on the leader breaks it off and drops hooks on whatever is below.',
      'This is a busy public promenade. Cast only from the fishing rail, and keep hooks, knives and bait buckets clear of walkers.',
    ],
    sources: [
      {
        id: 'st-pete-pier-official',
        label: 'St. Pete Pier — official site (fishing deck rules and hours)',
        url: 'https://stpetepier.org/faq/',
        publisher: 'City of St. Petersburg',
      },
      fwcPier('st_pete_pier', 'St. Petersburg Pier — facilities, hours and access'),
      noaaSource(STATION_ST_PETERSBURG, 'Harmonic reference station roughly a mile south of the pier on the same downtown waterfront.'),
    ],
  },
  {
    id: 'pass-a-grille-jetty',
    slug: 'pass-a-grille-jetty',
    name: 'Pass-a-Grille Jetty',
    region: 'St. Pete Beach',
    lat: 27.681,
    lng: -82.7405,
    access: ['shore', 'wade'],
    structures: ['jetty point', 'pass', 'surf trough', 'sandbar cuts'],
    station: STATION_TIERRA_VERDE,
    tide: 'Moving tide, dawn and dusk',
    dayparts: ['dawn', 'dusk', 'night'],
    targets: [
      { species: 'Snook', rig: 'free-line', hook: '2/0–4/0', leader: '30–40 lb', weight: 'none', bait: 'pilchard/live shrimp' },
      { species: 'Pompano', rig: 'surf rig', hook: '1/0', leader: '15–20 lb', weight: '1–3 oz pyramid', bait: 'sand flea/shrimp' },
      { species: 'Spanish mackerel', rig: 'casting spoon', hook: 'single hook', leader: '30–40 lb bite leader', weight: 'lure', bait: 'silver spoon/white jig' },
    ],
    seasons: [
      'Sep–Nov and Mar–May pompano along the trough',
      'May–Sep snook on the beach and the jetty rocks',
      'Spanish mackerel on the bait runs spring and fall',
    ],
    accessNotes: [
      'FWC lists the jetty at Gulf Way and 1st Ave, St. Pete Beach — open 24 hours, no entrance fee.',
      'Paid street parking along Gulf Way; it fills early on weekends and in season.',
      'A fish-cleaning table is the only facility at the jetty itself. Merry Pier, on the channel side of Pass-a-Grille, is the nearest bait.',
    ],
    safety: [
      'Pass-a-Grille Channel runs hard on both tides and the water beside the rocks is deep. Do not wade the channel side.',
      'Wet, weeded rock is the real injury risk here. If you go out on it, do it in daylight with grippy soles and both hands free.',
      'Water funnelling out of the pass on the fall sets up a rip alongside the jetty — do not try to swim back against it.',
    ],
    sources: [
      fwcPier('pass-a-grille', 'Pass-a-Grille fishing jetty — location, hours, facilities'),
      noaaSource(STATION_TIERRA_VERDE, 'Same water: the Tierra Verde station sits in the Pass-a-Grille Channel / Bunces Pass system behind the barrier islands.'),
    ],
  },
  {
    id: 'skyway-pier-north',
    slug: 'skyway-pier-north',
    name: 'Skyway Fishing Pier — North',
    region: 'Skyway',
    lat: 27.6363,
    lng: -82.668,
    access: ['pier'],
    structures: ['bridge pilings', 'deep channel', 'lights', 'current seam'],
    // Lower Tampa Bay, near the bay mouth. Mullet Key is the nearest station on
    // the same open channel water; Port Manatee is a similar distance east but
    // sits in a port basin and predicts nearly an hour later.
    station: STATION_MULLET_KEY,
    tide: 'Strong moving tide',
    dayparts: ['dawn', 'dusk', 'night'],
    targets: [
      { species: 'Snapper', rig: 'knocker', hook: '1/0–2/0', leader: '20–30 lb fluoro', weight: '1/4–1 oz', bait: 'live shrimp/pilchard' },
      { species: 'Spanish mackerel', rig: 'casting spoon', hook: 'single hook', leader: '30–40 lb bite leader', weight: 'lure', bait: 'silver spoon/white jig' },
      { species: 'Sheepshead', rig: 'bottom rig', hook: '1/0 short shank', leader: '20 lb fluoro', weight: '1/4–1 oz', bait: 'live shrimp/fiddler crab' },
      { species: 'Tarpon', rig: 'live bait under a float', hook: '5/0–8/0 circle', leader: '60–80 lb', weight: 'float only', bait: 'crab/threadfin/pinfish' },
    ],
    seasons: [
      'Jun–Sep tarpon through the bay mouth and mangrove snapper at night',
      'Mar–May and Oct–Nov Spanish mackerel and kingfish',
      'Dec–Mar sheepshead tight to the pilings',
    ],
    accessNotes: [
      'A drive-on pier: you pay at the entrance, drive out and park beside your spot on the deck. No RVs, trailers or heavy trucks.',
      'Open 24 hours, with a bait shop, restrooms and a fish-cleaning table on the pier.',
      'Florida State Parks lists a per-vehicle entry fee plus a per-person fishing fee — check the park page for the current amounts and exactly what the fishing fee covers.',
      'This entry is the north (Pinellas) pier only. The south pier was closed beyond its bait shop on 27 Oct 2025 after FDOT structural inspections, and the state announced in March 2026 that it will be replaced rather than repaired.',
    ],
    safety: [
      'Vehicles use the same deck you fish from. Stay inside the marked fishing area and look behind you before you swing a rod.',
      'The rail is a long way above the water — a pier net or drop net is not optional if you want to land anything of size.',
      'Over a mile of open concrete with no shade and no shortcut back: summer lightning and heat are the real hazards here, not the fish.',
    ],
    sources: [
      {
        id: 'fsp-skyway',
        label: 'Skyway Fishing Pier State Park — hours, fees and pier status',
        url: 'https://www.floridastateparks.org/parks-and-trails/skyway-fishing-pier-state-park',
        publisher: 'Florida State Parks (FDEP)',
      },
      fwcPier('Skyway_Pier_North', 'Skyway Fishing Pier State Park, north pier — facilities and restrictions'),
      {
        id: 'south-pier-closure',
        label: 'Part of south Skyway Fishing Pier closed after FDOT inspection (Oct 2025)',
        url: 'https://www.wusf.org/environment/2025-10-24/portion-skyway-south-fishing-pier-closes-due-age-related-structural-concerns',
        publisher: 'WUSF',
        note: 'Basis for treating the north pier as the only currently fishable Skyway pier.',
      },
      noaaSource(
        STATION_MULLET_KEY,
        'Nearest station on the same open lower-bay channel water. Phase at the bridge line runs slightly later than Mullet Key and earlier than Port Manatee, so treat the times as close rather than exact.',
      ),
    ],
  },
  {
    id: 'egmont-key',
    slug: 'egmont-key',
    name: 'Egmont Key',
    region: 'Skyway',
    lat: 27.6008,
    lng: -82.7607,
    access: ['boat', 'shore'],
    structures: ['deep channel', 'sandbar cuts', 'grass', 'surf trough'],
    station: STATION_EGMONT_KEY,
    tide: 'Moving tide',
    dayparts: ['dawn', 'dusk'],
    targets: [
      { species: 'Snook', rig: 'free-line', hook: '3/0–4/0', leader: '30–40 lb', weight: 'none', bait: 'pilchard/threadfin' },
      { species: 'Tarpon', rig: 'live crab', hook: '5/0–8/0 circle', leader: '60–80 lb', weight: 'drift dependent', bait: 'crab/threadfin' },
      { species: 'Snapper', rig: 'knocker', hook: '1/0–2/0', leader: '25–30 lb fluoro', weight: '1/2–1 oz', bait: 'live shrimp/pilchard' },
    ],
    seasons: [
      'May–Jul tarpon along the channel edge',
      'Jun–Sep snook on the island beaches and the old fort rubble',
      'Oct–Nov mackerel and kingfish off the west side',
    ],
    accessNotes: [
      'Boat access only — private boat, or the seasonal ferry that runs from Fort De Soto. There is no bridge and no dock for a road vehicle.',
      'No restrooms, no drinking water and no shelter beyond the trails. Everything you need comes in with you and goes back out.',
      'Several beaches and the south end are closed year-round as a bird nesting sanctuary, and are posted. Stay out of closed areas.',
      'A prop-exclusion zone protects the seagrass on the east side of the island.',
    ],
    safety: [
      'Egmont Channel is the main deep-water ship entrance to Tampa Bay: heavy commercial traffic, hard tide and a drop-off close to the beach.',
      'There is no help on the island. Carry water, sun cover, a way to call for help and a plan someone ashore knows about.',
    ],
    sources: [
      {
        id: 'fws-egmont',
        label: 'Egmont Key National Wildlife Refuge — activities, fishing and closed areas',
        url: 'https://www.fws.gov/refuge/egmont-key/visit-us/activities',
        publisher: 'U.S. Fish & Wildlife Service',
        note: 'Names seatrout, tarpon, snook, grouper and flounder in the designated fishing areas, and defines the year-round bird closures.',
      },
      {
        id: 'fsp-egmont',
        label: 'Egmont Key State Park — access and visitor information',
        url: 'https://www.floridastateparks.org/parks-and-trails/egmont-key-state-park',
        publisher: 'Florida State Parks (FDEP)',
      },
      noaaSource(STATION_EGMONT_KEY, 'The station sits on the island, in the channel this spot fishes.'),
    ],
  },
  {
    id: 'fort-de-soto-gulf-pier',
    slug: 'fort-de-soto-gulf-pier',
    name: 'Fort De Soto Gulf Pier',
    region: 'Fort De Soto',
    lat: 27.6135,
    lng: -82.7383,
    access: ['pier'],
    structures: ['pier pilings', 'deep channel', 'surf trough'],
    station: STATION_EGMONT_KEY,
    tide: 'Strong moving tide',
    dayparts: ['dawn', 'dusk'],
    targets: [
      { species: 'Spanish mackerel', rig: 'casting spoon', hook: 'single hook', leader: '30–40 lb bite leader', weight: 'lure', bait: 'silver spoon/white jig' },
      { species: 'Kingfish', rig: 'live bait under a float', hook: 'stinger rig', leader: 'short wire bite trace', weight: 'float only', bait: 'live threadfin/blue runner' },
      { species: 'Snapper', rig: 'knocker', hook: '1/0–2/0', leader: '20–30 lb fluoro', weight: '1/2–1 oz', bait: 'live shrimp/pilchard' },
      { species: 'Sheepshead', rig: 'bottom rig', hook: '1/0 short shank', leader: '20 lb fluoro', weight: '1/4–1 oz', bait: 'live shrimp/fiddler crab' },
    ],
    seasons: [
      'Apr–Jun and Oct–Nov kingfish and Spanish mackerel',
      'Jun–Sep mangrove snapper and passing tarpon',
      'Dec–Mar sheepshead and flounder',
    ],
    accessNotes: [
      'The longer of the park’s two piers, reaching out over the Egmont Channel side of Mullet Key. Bait-and-tackle shop and food concession at the head.',
      'Restrooms, fish-cleaning table, fresh water and monofilament recycling on the pier; it is wheelchair accessible.',
      'Published hours disagree — FWC’s guide lists sunrise to 11 pm, Pinellas County has listed 7 am to sunset since the storm repairs. Check the county page before planning a night session.',
      'Both piers reopened in January 2025 after Hurricanes Helene and Milton. Some park facilities, including boat-ramp docks, were still under repair into 2026.',
      'A park entrance fee applies, and the Pinellas Bayway approach is tolled.',
    ],
    safety: [
      'Mackerel and kingfish tackle means trebles, gaffs and long casts in a crowd. Look behind you and give the person beside you room.',
      'You are fishing over deep, fast water from a high deck — use the pier net rather than lifting a fish on the leader.',
      'Sharks are a normal catch here. Do not lean over the rail to unhook one; cut the leader and let it go.',
    ],
    sources: [
      fwcPier('Fort_DeSoto_Gulf_pier', 'Fort De Soto Gulf Pier — facilities, hours and fees'),
      {
        id: 'pinellas-fort-de-soto',
        label: 'Fort De Soto Park — hours, fees and facility status',
        url: 'https://pinellas.gov/parks/fort-de-soto-park/',
        publisher: 'Pinellas County Parks & Conservation Resources',
      },
      noaaSource(STATION_EGMONT_KEY, 'Same water: the pier fishes the Egmont Channel side of Mullet Key, about a mile and a half from the station.'),
    ],
  },
  {
    id: 'fort-de-soto-bay-pier',
    slug: 'fort-de-soto-bay-pier',
    name: 'Fort De Soto Bay Pier',
    region: 'Fort De Soto',
    lat: 27.616,
    lng: -82.726,
    access: ['pier'],
    structures: ['pier pilings', 'grass', 'sand potholes'],
    station: STATION_MULLET_KEY,
    tide: 'Moving tide',
    dayparts: ['dawn', 'dusk'],
    targets: [
      { species: 'Trout', rig: 'popping cork', hook: '1/0–2/0', leader: '15–20 lb', weight: 'light jig', bait: 'live shrimp' },
      { species: 'Redfish', rig: 'weedless paddletail', hook: '3/0–4/0', leader: '20–25 lb', weight: '1/16–1/8 oz', bait: 'paddletail/cut bait' },
      { species: 'Snook', rig: 'live bait', hook: '3/0–4/0', leader: '30–40 lb', weight: 'light', bait: 'pilchard/pinfish' },
    ],
    seasons: [
      'Trout on the grass most of the year',
      'Apr–Oct snook around the pilings',
      'Dec–Mar sheepshead and flounder off the pier',
    ],
    accessNotes: [
      'The shorter of the two piers and the one on the sheltered Tampa Bay side, so there is less current and the fish are the everyday inshore species rather than the offshore visitors.',
      'Bait and tackle, restrooms, fish-cleaning table and fresh water; wheelchair accessible.',
      'Same hours confusion as the Gulf Pier — FWC lists sunrise to 11 pm, the county has listed 7 am to sunset. Confirm before a night trip.',
      'A park entrance fee applies, and the Pinellas Bayway approach is tolled.',
    ],
    safety: [
      'Shallow, weedy water under a high deck: land fish with the net rather than swinging them, and watch your step on wet planking.',
      'Boat traffic runs close to the pier on its way in and out of the park basin.',
    ],
    sources: [
      fwcPier('Fort_DeSoto_Bay_pier', 'Fort De Soto Bay Pier — facilities, hours and fees'),
      {
        id: 'pinellas-fort-de-soto',
        label: 'Fort De Soto Park — hours, fees and facility status',
        url: 'https://pinellas.gov/parks/fort-de-soto-park/',
        publisher: 'Pinellas County Parks & Conservation Resources',
      },
      noaaSource(STATION_MULLET_KEY, 'The station is about a kilometre from the pier on the same Tampa Bay side of Mullet Key.'),
    ],
  },
  {
    id: 'bunces-pass-shell-key',
    slug: 'bunces-pass-shell-key',
    name: 'Bunces Pass / Shell Key',
    region: 'Fort De Soto',
    lat: 27.6501,
    lng: -82.7392,
    access: ['kayak', 'boat', 'wade'],
    structures: ['pass', 'sandbar cuts', 'grass', 'sand potholes', 'mangrove'],
    station: STATION_TIERRA_VERDE,
    tide: 'Low incoming',
    dayparts: ['dawn', 'dusk'],
    targets: [
      { species: 'Redfish', rig: 'weedless paddletail', hook: '3/0–4/0', leader: '20–25 lb', weight: '1/16–1/8 oz', bait: 'paddletail/cut bait' },
      { species: 'Trout', rig: 'popping cork', hook: '1/0–2/0', leader: '15–20 lb', weight: 'light jig', bait: 'live shrimp' },
      { species: 'Snook', rig: 'free-line', hook: '2/0–4/0', leader: '30–40 lb', weight: 'none', bait: 'pilchard' },
    ],
    seasons: [
      'Apr–Oct snook in and around the pass',
      'Redfish on the east-side flats most of the year',
      'Sep–Nov pompano and mackerel through the pass',
    ],
    accessNotes: [
      'Boat or paddle only — there is no road to Shell Key. Common access is the Pinellas Bayway kayak/SUP launch on Tierra Verde, the Fort De Soto boat ramp, or the ferry that runs from that ramp.',
      'The middle of Shell Key is a Bird Preservation Area and is closed to entry. Landing is only allowed in the marked public use areas.',
      'Overnight camping is restricted to the southern public use area and needs a Pinellas County permit.',
      'No restrooms, no water and no shade on the key.',
    ],
    safety: [
      'Bunces Pass carries strong tide and shifting sandbars either side of the mouth. The Gulf entrance is the roughest way in or out.',
      'Crossing the pass in a kayak is an open-water crossing with boat traffic — check wind against tide before you commit, not after.',
      'Wade the flats with a shuffling step; rays bury on the sand between the grass.',
    ],
    sources: [
      {
        id: 'pinellas-shell-key',
        label: 'Shell Key Preserve — access, closed bird areas and rules',
        url: 'https://pinellas.gov/parks/shell-key-preserve/',
        publisher: 'Pinellas County Parks & Conservation Resources',
      },
      {
        id: 'shell-key-launch',
        label: 'Where to launch a kayak to Shell Key',
        url: 'https://shellkey.org/where-to-launch-a-kayak-to-shell-key',
        publisher: 'Friends of Shell Key',
        note: 'Community source, used only for launch logistics and the local read on Bunces Pass — not for regulations.',
      },
      noaaSource(STATION_TIERRA_VERDE, 'Same water: the station sits in the Pass-a-Grille Channel / Bunces Pass system a couple of miles north.'),
    ],
  },
  {
    id: 'new-pass-ken-thompson',
    slug: 'new-pass-ken-thompson',
    name: 'New Pass / Ken Thompson Park',
    region: 'Sarasota',
    lat: 27.3351,
    lng: -82.575,
    access: ['shore', 'kayak', 'boat'],
    structures: ['pass', 'seawall', 'docks', 'grass'],
    station: STATION_LONGBOAT_KEY,
    tide: 'Moving tide',
    dayparts: ['dawn', 'dusk', 'night'],
    targets: [
      { species: 'Snook', rig: 'live bait', hook: '2/0–4/0', leader: '30–40 lb', weight: '0–1/2 oz', bait: 'pilchard/live shrimp' },
      { species: 'Snapper', rig: 'knocker', hook: '1/0–2/0', leader: '20–25 lb fluoro', weight: '1/4–1/2 oz', bait: 'live shrimp' },
      { species: 'Sheepshead', rig: 'bottom rig', hook: '1/0 short shank', leader: '20 lb fluoro', weight: '1/4–1/2 oz', bait: 'live shrimp/fiddler crab' },
    ],
    seasons: [
      'Apr–Oct snook on the pass edges',
      'Jun–Sep mangrove snapper around the structure',
      'Dec–Mar sheepshead on the seawall and pilings',
    ],
    accessNotes: [
      'City of Sarasota park on City Island, between Lido Key and Longboat Key, with shoreline access along New Pass. Open during posted daily park hours.',
      'Three-lane boat ramp, kayak launch, restrooms and picnic area. Trailer parking is the busiest in the city and fills early on weekends.',
    ],
    safety: [
      'New Pass is narrow, busy and carries real current. Expect constant boat traffic in the channel, wake against the shoreline and a fast drop-off.',
      'If you fish near the ramp, watch for reversing trailers — that end of the park is a working launch, not a fishing platform.',
    ],
    sources: [
      {
        id: 'sarasota-ken-thompson',
        label: 'Ken Thompson Park — hours, ramp and facilities',
        url: 'https://www.letsplaysarasota.com/parks/ken-thompson-park',
        publisher: 'City of Sarasota Parks and Recreation',
      },
      noaaSource(STATION_LONGBOAT_KEY, 'Same water: the station is on the Sarasota Bay side just north of New Pass. The Sarasota city-front station is further from the pass and less representative of it.'),
    ],
  },
  {
    id: 'south-lido-park',
    slug: 'south-lido-park',
    name: 'South Lido Park / Big Sarasota Pass',
    region: 'Sarasota',
    lat: 27.3036,
    lng: -82.5678,
    access: ['shore', 'kayak', 'wade'],
    structures: ['pass', 'grass', 'mangrove', 'surf trough', 'sand potholes'],
    station: STATION_BIG_SARASOTA_PASS,
    tide: 'Moving tide',
    dayparts: ['dawn', 'dusk'],
    targets: [
      { species: 'Snook', rig: 'free-line', hook: '2/0–4/0', leader: '30–40 lb', weight: 'none', bait: 'pilchard/live shrimp' },
      { species: 'Redfish', rig: 'weedless paddletail', hook: '3/0–4/0', leader: '20–25 lb', weight: '1/16–1/8 oz', bait: 'paddletail/cut bait' },
      { species: 'Trout', rig: 'popping cork', hook: '1/0–2/0', leader: '15–20 lb', weight: 'light jig', bait: 'live shrimp' },
    ],
    seasons: [
      'May–Sep snook along the pass and the beach cuts',
      'Redfish and trout on the bay-side grass most of the year',
      'Sep–Nov pompano and mackerel off the pass beach',
    ],
    accessNotes: [
      'Sarasota County park (Ted Sperling Park) at the south end of Lido Key, wrapping the Gulf, Big Pass, Sarasota Bay and Bushy Bayou. Parking is free.',
      'Restrooms, shaded picnic areas, nature trails and a canoe/kayak launch into the mangrove trail.',
      'Big Pass is posted no-swimming because of the current — treat it as fishing and paddling access, not a swimming beach.',
    ],
    safety: [
      'Big Sarasota Pass runs hard, particularly on the northwest side, and the bottom drops away close to the beach.',
      'The mangrove canoe trail is a maze at high water and can leave you aground at low. Know the stage before you paddle in.',
      'Shuffle your feet on the sand flats and in the potholes — rays bury there.',
    ],
    sources: [
      {
        id: 'sarasota-ted-sperling',
        label: 'Ted Sperling Park at South Lido Beach — facilities and access',
        url: 'https://www.sarasotacountyparks.com/Home/Components/FacilityDirectory/FacilityDirectory/853/6738',
        publisher: 'Sarasota County Parks, Recreation and Natural Resources',
      },
      {
        id: 'visit-sarasota-south-lido',
        label: 'Ted Sperling Park at South Lido Beach — visitor guide',
        url: 'https://www.visitsarasota.com/beaches-parks/ted-sperling-park-south-lido-beach',
        publisher: 'Visit Sarasota County',
      },
      noaaSource(STATION_BIG_SARASOTA_PASS, 'The station is in Big Sarasota Pass itself, on the Siesta Key side of the same inlet this spot fishes.'),
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
  seasons: s.seasons ?? [],
  dayparts: s.dayparts ?? [],
  tide_playbook: playbook(s.structures, s.tide),
  targets: targets(s.targets),
  // Deliberately empty everywhere: the page renders a live satellite map for
  // the spot rather than a stock photo of a shoreline that is not this one.
  images: [],
  safety: s.safety ?? [],
  access_notes: s.accessNotes ?? [],
  sources: s.sources ?? [],
}));

export const locationBySlug = (slug: string): Location | undefined =>
  LOCATIONS.find((l) => l.slug === slug);

/** North to south, which is how the "spots by area" list reads on Home. */
export const REGIONS: Region[] = [
  'St. Petersburg',
  'St. Pete Beach',
  'Skyway',
  'Fort De Soto',
  'Bradenton',
  'Anna Maria',
  'Sarasota',
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
