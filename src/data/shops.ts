import type { Region, SourceRef } from './types';

/**
 * Tackle, bait and access businesses near the guide's spots.
 *
 * EDITORIAL and bundled, exactly like locations and species: researched, not
 * sold. Whether a shop pays for anything lives in a separate layer
 * (`src/lib/sponsorship.ts`) and cannot add a shop, hide one, or change a fact
 * here.
 *
 * The separation is the point. A directory that lists only advertisers has no
 * readers, so there is nothing to sell — and the first angler who notices the
 * shop across the street is missing stops trusting the guide. Payment buys
 * prominence, never presence, and never a competitor's removal.
 *
 * CONTENT RULE, stricter here than anywhere else in the guide. These are real
 * businesses. A plausible-but-wrong address, phone number or opening time
 * sends someone across the county to a closed door. Nothing in this file was
 * written from general knowledge: every entry traces to `docs/research/`, and
 * any field that could not be verified is `null` or empty rather than guessed.
 *
 * Two flags exist because they change what belongs in front of a reader:
 *
 * `independent` — false for chain and municipal operators (Safe Harbor, IGY,
 * Suntex, city marinas). A guide built around small shops you can talk to
 * should be able to filter them out, and the owner console does.
 *
 * `verification` — 'needs_check' means a real business whose hours, stock,
 * coordinate or address could not be confirmed first-party. Those are listed
 * so the owner can chase them, and they should not reach readers until
 * someone has made the call. The console shows the state on every row.
 */

/** What the business actually is. A shop can be more than one. */
export type ShopKind = 'tackle' | 'bait' | 'marina' | 'ramp' | 'charter';

/** How much of this entry has been confirmed first-party. */
export type ShopVerification = 'verified' | 'needs_check';

export interface Shop {
  id: string;
  slug: string;
  name: string;
  kind: ShopKind[];
  region: Region;
  lat: number;
  lng: number;
  address: string;
  phone: string | null;
  website: string | null;
  /** False for chain and municipal operators. */
  independent: boolean;
  verification: ShopVerification;
  /** Verified stock. Empty means "not researched", never "carries nothing". */
  carries: string[];
  /** Opening times as published, or null. A wrong one is worse than none. */
  hours: string | null;
  /**
   * Spots this shop is a practical bait stop for.
   *
   * Computed from the spot's side rather than the shop's: a shop serves a
   * location when it is one of the three closest to it, within 25 miles.
   * "Every shop within N miles" collapses into noise — at a 12-mile radius one
   * shop claimed 15 of the 25 spots, which tells a reader nothing.
   */
  serves: string[];
  /** Researched notes. Never sales copy — that lives in the sponsorship layer. */
  notes: string[];
  sources: SourceRef[];
}

/**
 * The directory. Researched Aug 2026 from `docs/research/shops-*.md`.
 *
 * Deliberately includes businesses marked `needs_check` and businesses that
 * are not independent. Both are decisions for the owner in the console, not
 * for this file — and a shop missing from here entirely cannot be decided
 * about at all.
 */
export const SHOPS: Shop[] = [
  {
    id: 'bridge-street-bait-shop',
    slug: 'bridge-street-bait-shop',
    name: 'Bridge Street Bait Shop',
    kind: ['bait', 'tackle'],
    region: 'Anna Maria',
    lat: 27.4651,
    lng: -82.6983,
    address: '200 Bridge Street, Building A, Bradenton Beach, FL 34217',
    phone: '941-330-0650',
    website: 'https://www.bridgestreetbaitshop.com/',
    independent: true,
    verification: 'verified',
    carries: [
      'live shrimp',
      'frozen shrimp',
      'squid',
      'sand fleas',
      'pinfish (sometimes)',
    ],
    hours: '7 days, 7:00am–8:00pm',
    serves: [
      'palma-sola-bay',
      'bridge-street-pier',
      'longboat-pass',
      'coquina-beach',
      'bean-point',
      'cortez-bridge',
      'south-palma-sola-flats',
    ],
    notes: [
      'Rod rental available.',
      'On Bridge Street Pier — the pier’s floating dock section is still closed for Milton repairs.',
    ],
    sources: [
      { id: 'www.bridgestreetbaitshop.com', label: 'live shrimp, frozen shrimp, squid, sand fleas, sometimes pinfish; hour', url: 'https://www.bridgestreetbaitshop.com/faq', publisher: 'Bridge Street Bait Shop' },
    ],
  },
  {
    id: 'palmetto-bait-and-tackle',
    slug: 'palmetto-bait-and-tackle',
    name: 'Palmetto Bait and Tackle',
    kind: ['bait', 'tackle'],
    region: 'Bradenton',
    lat: 27.5178,
    lng: -82.573,
    address: '709 8th Ave. W., Palmetto, FL 34221',
    phone: '941-479-7361',
    website: 'https://palmettobaitandtackle.com/',
    independent: true,
    verification: 'verified',
    carries: [
      'live shrimp (sm/med/lg/jumbo)',
      'pinfish',
      'pass crab',
      'greenbacks',
      'live worms',
      'fiddler crabs (when available)',
      'frozen: rock shrimp, threadfin herring, sardines, blue crab, chum, octopus, sand fleas, squid, mullet, ladyfish, bonita, ballyhoo',
    ],
    hours: null,
    serves: [
      'emerson-point',
      'green-bridge',
      'bradenton-riverwalk',
    ],
    notes: [
      '2026 Gold, Best Bait & Tackle Shop (also 2024 and 2025) — the strongest recency signal found in the region.',
      'Hours are not published first-party; a directory lists Mon 6a–4p, Tue–Sat 6a–6p, Sun 6a–5p, unverified.',
    ],
    sources: [
      { id: 'palmettobaitandtackle.com', label: 'live shrimp (sm/med/lg/jumbo), pinfish, passcrab, greenbacks, live wor', url: 'https://palmettobaitandtackle.com/', publisher: 'Palmetto Bait and Tackle' },
    ],
  },
  {
    id: 'cortez-bait-and-seafood',
    slug: 'cortez-bait-and-seafood',
    name: 'Cortez Bait & Seafood',
    kind: ['bait'],
    region: 'Anna Maria',
    lat: 27.4693,
    lng: -82.6836,
    address: '12110 Cortez Rd. W., Cortez, FL 34215',
    phone: '941-794-1547',
    website: 'https://www.cortezbaitandseafood.com/',
    independent: true,
    verification: 'needs_check',
    carries: [
      'fresh seafood',
      'shellfish',
      'shrimp',
      'smoked mullet',
    ],
    hours: 'Retail Mon–Sat 10am–6pm, Sun 10am–5pm',
    serves: [
      'emerson-point',
      'palma-sola-bay',
      'bridge-street-pier',
      'longboat-pass',
      'coquina-beach',
      'bean-point',
      'cortez-bridge',
      'south-palma-sola-flats',
    ],
    notes: [
      'At the mainland foot of Cortez Bridge.',
      'Their own site states WHOLESALE bait only. A secondary source describes a ~6am shop that "rarely runs out of live shrimp" — unconfirmed, and it conflicts with the published 10am retail opening. Call before relying on live bait.',
    ],
    sources: [
      { id: 'www.cortezbaitandseafood.com', label: 'wholesale bait only, plus fresh seafood, shellfish, shrimp, smoked mul', url: 'https://www.cortezbaitandseafood.com/about/', publisher: 'Cortez Bait & Seafood' },
    ],
  },
  {
    id: 'island-discount-tackle',
    slug: 'island-discount-tackle',
    name: 'Island Discount Tackle',
    kind: ['tackle', 'bait', 'marina'],
    region: 'Anna Maria',
    lat: 27.5079,
    lng: -82.7144,
    address: '5503 Marina Drive, Holmes Beach, FL 34217',
    phone: '941-779-2838',
    website: 'https://www.islanddiscounttackle.com/',
    independent: true,
    verification: 'needs_check',
    carries: [
      'live bait',
      'frozen bait',
      '100+ saltwater fly patterns',
      'fishing licences',
    ],
    hours: 'Opens 7am, 7 days — no closing time published',
    serves: [
      'palma-sola-bay',
      'bridge-street-pier',
      'longboat-pass',
      'coquina-beach',
      'bean-point',
      'cortez-bridge',
      'south-palma-sola-flats',
      'egmont-key',
      'fort-de-soto-gulf-pier',
      'fort-de-soto-bay-pier',
      'bunces-pass-shell-key',
    ],
    notes: [
      'At Keyes Marina; fuel and 19 slips to 30 ft.',
      'Species not published. Their own sites are stale (© 2012–2023, fishing reports end 2019) though third-party listings show 2026 activity. Call first.',
    ],
    sources: [
      { id: 'keyesmarina.com', label: 'live and frozen bait', url: 'https://keyesmarina.com/tackle-shop/', publisher: 'Keyes Marina' },
    ],
  },
  {
    id: 'fishermens-headquarters',
    slug: 'fishermens-headquarters',
    name: 'Fishermen\'s Headquarters',
    kind: ['tackle'],
    region: 'Bradenton',
    lat: 27.4951,
    lng: -82.5545,
    address: '924 Manatee Avenue East, Bradenton, FL 34208',
    phone: '941-587-7758',
    website: 'https://www.fishermensheadquarters.com/',
    independent: true,
    verification: 'verified',
    carries: [
      'rods',
      'reels',
      'terminal tackle',
      'braid and fluorocarbon leader',
      'lures',
      'fillet knives',
      'kayak accessories',
      'cast nets',
    ],
    hours: 'Tue–Thu 10:30am–5pm, Fri 10:30am–4pm, Sat 9am–3pm; closed Sun–Mon',
    serves: [
      'green-bridge',
      'bradenton-riverwalk',
    ],
    notes: [
      'No bait — tackle only. Very close to Green Bridge and Bradenton Riverwalk.',
      '2026 Silver, Best Marine Supply Store.',
    ],
    sources: [
      { id: 'www.fishermensheadquarters.com', label: 'rods, reels, terminal tackle, lures, cast nets; Tue-Thu 10:30a-5p', url: 'https://www.fishermensheadquarters.com/contact', publisher: 'Fishermen’s Headquarters' },
    ],
  },
  {
    id: 'skyway-bait-and-tackle',
    slug: 'skyway-bait-and-tackle',
    name: 'Skyway Bait & Tackle',
    kind: ['bait', 'tackle'],
    region: 'Skyway',
    lat: 27.612,
    lng: -82.576,
    address: '4808 US 19, Palmetto, FL (side entrance on 49th Ave)',
    phone: '941-357-1122',
    website: 'https://skywaybait.com/',
    independent: true,
    verification: 'needs_check',
    carries: [
      'live shrimp',
      'pinfish',
      'greenbacks',
      'frozen squid',
      'sardines',
      'chum',
    ],
    hours: null,
    serves: [
      'skyway-pier-north',
    ],
    notes: [
      'COORDINATE UNVERIFIED — no ZIP published and no geocoder match. Pull the pin from their Google Maps listing before publishing.',
      'Far north Palmetto near the Skyway; a long haul from the Anna Maria and Cortez spots.',
    ],
    sources: [
      { id: 'skywaybait.com', label: 'live: shrimp, pinfish, greenbacks; frozen: squid, sardines, chum', url: 'https://skywaybait.com/', publisher: 'Skyway Bait & Tackle' },
    ],
  },
  {
    id: 'gator-jims-pier-shop',
    slug: 'gator-jims-pier-shop',
    name: 'Gator Jim\'s Tackle — Pier Shop',
    kind: ['tackle', 'bait'],
    region: 'St. Petersburg',
    lat: 27.7737,
    lng: -82.6224,
    address: '800 2nd Ave NE, Ground Floor, St. Petersburg, FL 33701',
    phone: '727-289-8499',
    website: 'https://gatorjims.com/',
    independent: true,
    verification: 'verified',
    carries: [
      'hooks',
      'weights',
      'lures',
      'frozen bait',
      'nets',
      'beverages',
      'snacks',
    ],
    hours: 'Mon–Sat 10am–8pm, Sun 10am–7pm',
    serves: [
      'st-pete-pier',
    ],
    notes: [
      'Literally on the St. Pete Pier fishing deck.',
      'The business publishes 800 2nd Ave NE; the Pier’s official address is 600 2nd Ave NE.',
    ],
    sources: [
      { id: 'gatorjims.com', label: 'hooks, weights, lures, and frozen bait', url: 'https://gatorjims.com/', publisher: 'Gator Jim’s Tackle' },
      { id: 'stpetepier.org', label: 'gear, tackle, nets, frozen bait and more', url: 'https://stpetepier.org/poi/fishing-deck-and-bait-shop/', publisher: 'St. Pete Pier' },
    ],
  },
  {
    id: 'gator-jims-main-shop',
    slug: 'gator-jims-main-shop',
    name: 'Gator Jim\'s Tackle — Main Shop',
    kind: ['tackle', 'bait'],
    region: 'St. Petersburg',
    lat: 27.7091,
    lng: -82.6688,
    address: '3301 Pinellas Point Drive South, St. Petersburg, FL 33712',
    phone: '727-363-0900',
    website: 'https://gatorjims.com/',
    independent: true,
    verification: 'needs_check',
    carries: [
      'bait',
      'ice',
      'hooks',
      'terminal tackle',
      'rods',
      'reels',
      'sunglasses',
    ],
    hours: 'Mon–Sat 8am–6pm, Sun 8am–5pm',
    serves: [
      'pass-a-grille-jetty',
      'skyway-pier-north',
      'egmont-key',
      'fort-de-soto-gulf-pier',
      'fort-de-soto-bay-pier',
      'bunces-pass-shell-key',
    ],
    notes: [
      'COORDINATE APPROXIMATE — street centroid only, no house-number match. Confirm the pin.',
      'Site does not say LIVE bait. Near the Maximo Park ramp.',
    ],
    sources: [
      { id: 'gatorjims.com', label: 'bait, ice, hooks, terminal tackle; Mon-Sat 8am-6pm', url: 'https://gatorjims.com/', publisher: 'Gator Jim’s Tackle' },
    ],
  },
  {
    id: 'oneills-marina',
    slug: 'oneills-marina',
    name: 'O\'Neill\'s Marina',
    kind: ['marina', 'bait', 'tackle', 'ramp'],
    region: 'Skyway',
    lat: 27.7075,
    lng: -82.6806,
    address: '6701 Sunshine Skyway Ln S, St. Petersburg, FL 33711',
    phone: '727-867-2585',
    website: 'https://oneillsmarina.com/',
    independent: true,
    verification: 'verified',
    carries: [
      'live shrimp',
      'live pinfish',
      'live crabs (seasonal)',
      'frozen squid',
      'chum blocks',
      'frozen shrimp',
      'sardines',
      'finger mullet',
      'ballyhoo',
      'ice',
      'lures',
      'terminal tackle',
    ],
    hours: 'Summer 5am–8pm, winter 5am–7pm, open 365 days',
    serves: [
      'pass-a-grille-jetty',
      'skyway-pier-north',
      'egmont-key',
      'fort-de-soto-gulf-pier',
      'fort-de-soto-bay-pier',
      'bunces-pass-shell-key',
    ],
    notes: [
      'Private boat ramp, $7/day.',
      'The best-stocked live bait found near the Skyway.',
    ],
    sources: [
      { id: 'oneillsmarina.com', label: 'Live: shrimp, pinfish, crabs (seasonally). Frozen: squid, chum blocks,', url: 'https://oneillsmarina.com/bait-shop/', publisher: 'O’Neill’s Marina' },
    ],
  },
  {
    id: 'riviera-bait-and-tackle',
    slug: 'riviera-bait-and-tackle',
    name: 'Riviera Bait & Tackle',
    kind: ['bait', 'tackle'],
    region: 'St. Petersburg',
    lat: 27.8574,
    lng: -82.6488,
    address: '1106 94th Ave N, St. Petersburg, FL 33702',
    phone: '727-954-6365',
    website: 'https://www.rivierabait.com/',
    independent: true,
    verification: 'needs_check',
    carries: [
      'live shrimp',
      'fiddler crabs',
      'pinfish',
      'lures',
      'rods',
      'reels',
      'line',
      'custom rod building and repair',
    ],
    hours: null,
    serves: [
      'weedon-island',
    ],
    notes: [
      'Closest dedicated bait shop to Weedon Island.',
      'They run their own water system for salinity and oxygen.',
      'No hours published anywhere and the site footer reads 2024. Call before publish.',
    ],
    sources: [
      { id: 'www.rivierabait.com', label: 'the highest quality and freshest live SHRIMP, FIDDLER CRABS and PINFIS', url: 'https://www.rivierabait.com/live-bait-St-Pete', publisher: 'Riviera Bait & Tackle' },
    ],
  },
  {
    id: 'mitchs-bait-n-tackle',
    slug: 'mitchs-bait-n-tackle',
    name: 'Mitch\'s Bait N Tackle',
    kind: ['bait', 'tackle'],
    region: 'St. Petersburg',
    lat: 27.828,
    lng: -82.6378,
    address: '331 Southeast Blvd N, St. Petersburg, FL 33703',
    phone: '727-826-0265',
    website: null,
    independent: true,
    verification: 'needs_check',
    carries: [],
    hours: null,
    serves: [
      'weedon-island',
    ],
    notes: [
      'Shore Acres / Edgemoor. No website.',
      'Stock and hours appear only in aggregator listings, never first-party — treat both as unverified. The address and phone are solid.',
    ],
    sources: [
    ],
  },
  {
    id: '4th-street-tackle',
    slug: '4th-street-tackle',
    name: '4th Street Tackle',
    kind: ['bait', 'tackle'],
    region: 'St. Petersburg',
    lat: 27.8104,
    lng: -82.6385,
    address: '4201 4th St. N., Suite 1, St. Petersburg, FL 33703',
    phone: '727-822-8326',
    website: null,
    independent: true,
    verification: 'needs_check',
    carries: [
      'live shrimp',
      'chum',
      'sardines',
      'rods',
      'reels',
      'tackle',
      'apparel',
    ],
    hours: 'Sun 6:30am–6pm, Mon 8am–6pm, Tue CLOSED, Wed–Thu 8am–6:30pm, Fri 8am–7pm, Sat 6:30am–7pm',
    serves: [
      'weedon-island',
      'st-pete-pier',
    ],
    notes: [
      'Website omitted deliberately: their TLS certificate has expired and the browser throws a security warning.',
      'Two conflicting published hour sets; the one above is the current Apple Maps set. Their own site (stamped 2021) shows Tuesday open. Verify by phone.',
    ],
    sources: [
      { id: 'maps.apple.com', label: 'status Open; Tue Closed; Wed-Thu 8am-6:30pm', url: 'https://maps.apple.com/place?place-id=I61036DFBC7FAF869', publisher: 'Apple Maps' },
    ],
  },
  {
    id: 'gandy-bait-and-tackle',
    slug: 'gandy-bait-and-tackle',
    name: 'Gandy Bait & Tackle',
    kind: ['bait', 'tackle'],
    region: 'St. Petersburg',
    lat: 27.8935,
    lng: -82.5291,
    address: '4923 W. Gandy Blvd, Tampa, FL 33611',
    phone: '813-839-5551',
    website: 'https://www.gandybaitandtackle.com/',
    independent: true,
    verification: 'verified',
    carries: [
      'live shrimp (3 sizes)',
      'pinfish',
      'chubs and fiddler crabs (sometimes)',
      'frozen bait',
      'chum',
      'weights',
      'hooks',
      'line',
      'ice',
    ],
    hours: 'Sun 5am–9pm, Mon–Thu 6am–9pm, Fri–Sat 5am–9pm',
    serves: [],
    notes: [
      'Tampa side of the Gandy Bridge, not St. Pete. In business since 1989, just east of the Gandy ramp.',
    ],
    sources: [
      { id: 'www.gandybaitandtackle.com', label: 'live and frozen bait; shrimp in 3 sizes, pinfish; Sun 5:00am-9:00pm', url: 'https://www.gandybaitandtackle.com/contact/', publisher: 'Gandy Bait & Tackle' },
    ],
  },
  {
    id: 'new-pass-grill-and-bait-shop',
    slug: 'new-pass-grill-and-bait-shop',
    name: 'New Pass Grill & Bait Shop',
    kind: ['bait', 'tackle', 'charter'],
    region: 'Sarasota',
    lat: 27.3318,
    lng: -82.5808,
    address: '1505 Ken Thompson Pkwy, Sarasota, FL 34236',
    phone: '941-388-1618',
    website: 'https://newpassgrill.com/',
    independent: true,
    verification: 'verified',
    carries: [
      'live bait',
      'full tackle wall',
      'ice',
      'pole rentals',
    ],
    hours: 'Daily 7am–6pm; bait shop opens 6am',
    serves: [
      'new-pass-ken-thompson',
      'south-lido-park',
    ],
    notes: [
      'Right at Ken Thompson Park on New Pass. Grill on site.',
      'Live bait species not itemised first-party.',
    ],
    sources: [
      { id: 'newpassgrill.com', label: 'live bait, full tackle wall, ice, pole rentals; daily 7am-6pm, bait sh', url: 'https://newpassgrill.com/', publisher: 'New Pass Grill & Bait Shop' },
    ],
  },
  {
    id: 'economy-tackle',
    slug: 'economy-tackle',
    name: 'Economy Tackle / Dolphin Paddlesports',
    kind: ['tackle', 'bait'],
    region: 'Sarasota',
    lat: 27.2667,
    lng: -82.5285,
    address: '6018 S Tamiami Trail, Sarasota, FL 34231',
    phone: '941-922-9671',
    website: 'https://floridakayak.com/',
    independent: true,
    verification: 'verified',
    carries: [
      'live shrimp',
      'live worms',
      'salt and fresh water tackle',
      'fly and spinning tackle',
    ],
    hours: 'Mon–Sat 8am–6pm, Sun 9am–3pm',
    serves: [
      'new-pass-ken-thompson',
      'south-lido-park',
    ],
    notes: [
      'In business since 1948.',
      'economytackle.com now redirects to floridakayak.com — same business, combined site, not a dead-domain trap.',
    ],
    sources: [
      { id: 'floridakayak.com', label: 'live bait - shrimp and worms; largest selection of salt and fresh wate', url: 'https://floridakayak.com/', publisher: 'Economy Tackle' },
    ],
  },
  {
    id: 'cbs-saltwater-outfitters',
    slug: 'cbs-saltwater-outfitters',
    name: 'CB\'s Saltwater Outfitters',
    kind: ['tackle', 'bait', 'marina'],
    region: 'Sarasota',
    lat: 27.2524,
    lng: -82.5337,
    address: '1249 Old Stickney Point Rd, Sarasota, FL 34242',
    phone: '941-349-4400',
    website: 'https://cbsoutfitters.com/',
    independent: true,
    verification: 'needs_check',
    carries: [
      'bait',
      'tackle',
    ],
    hours: null,
    serves: [
      'englewood-beach',
      'lemon-bay-mangroves',
      'new-pass-ken-thompson',
      'south-lido-park',
    ],
    notes: [
      'ADDRESS FLAG — their site publishes "1249 Stickney Point Rd, Siesta Key"; the geocoder only matched "1249 OLD Stickney Point Rd", a parallel street. Confirm before the pin ships.',
      'Self-described "largest on the water Bait & Tackle Shop in Sarasota"; species not itemised. Hours not published.',
    ],
    sources: [
      { id: 'cbsoutfitters.com', label: 'A COMPLETE BAIT & TACKLE SHOP; largest on the water Bait & Tackle Shop', url: 'https://cbsoutfitters.com/', publisher: 'CB’s Saltwater Outfitters' },
    ],
  },
  {
    id: 'fishin-franks',
    slug: 'fishin-franks',
    name: 'Fishin\' Frank\'s Bait & Tackle',
    kind: ['bait', 'tackle'],
    region: 'Englewood',
    lat: 26.9762,
    lng: -82.0912,
    address: '4200 Unit P Tamiami Trail, Port Charlotte, FL 33952',
    phone: '941-625-3888',
    website: 'https://fishinfranks.com/',
    independent: true,
    verification: 'needs_check',
    carries: [
      'live shrimp',
      'live crabs',
      'live fish',
      'worms',
      'minnows',
      'night crawlers',
      'shiners',
      'frozen: shrimp, mullet, sardines, crabs, ballyhoo, sand fleas, clams, jacks, ladyfish, bonita, finger mullet, greenbacks, cigar minnows',
    ],
    hours: 'Mon–Thu 6am–6:30pm, Fri–Sat 6am–7pm, Sun 6am–6pm',
    serves: [
      'stump-pass',
      'englewood-beach',
      'lemon-bay-mangroves',
      'placida-gasparilla-sound',
      'boca-grande-pass',
    ],
    notes: [
      'The largest and best-documented bait stock found for this whole coast — but a Port Charlotte address, roughly 8–9 miles from Englewood Beach and Lemon Bay by road. A "stock up before you go" stop, not an on-the-water one.',
      'COORDINATE APPROXIMATE — not geocoded when researched. Confirm the pin.',
      'Their dated weekly per-place fishing reports are what carry several Englewood and Placida season notes to high confidence.',
    ],
    sources: [
      { id: 'fishinfranks.com', label: 'live: shrimp, crabs, fish, worms, minnows, night crawlers, shiners; Mo', url: 'https://fishinfranks.com/', publisher: 'Fishin’ Frank’s' },
    ],
  },
  {
    id: 'gasparilla-marina',
    slug: 'gasparilla-marina',
    name: 'Gasparilla Marina',
    kind: ['marina', 'bait', 'tackle'],
    region: 'Placida',
    lat: 26.8497,
    lng: -82.2698,
    address: '15001 Gasparilla Rd, Placida, FL 33946',
    phone: '941-697-2280',
    website: 'https://gasparillamarina.com/',
    independent: true,
    verification: 'needs_check',
    carries: [
      'frozen squid',
      'rigged sardines',
      'mullet',
      'chum blocks',
      'apparel',
      'ice',
    ],
    hours: null,
    serves: [
      'stump-pass',
      'englewood-beach',
      'lemon-bay-mangroves',
      'placida-gasparilla-sound',
      'boca-grande-pass',
    ],
    notes: [
      'NO LIVE BAIT stated — do not claim it.',
      'COORDINATE UNVERIFIED — the geocoder returned zero matches for this address. Pull the pin from Google Maps or OSM before publishing.',
      'The only verified bait source found in Placida.',
    ],
    sources: [
      { id: 'gasparillamarina.com', label: 'frozen squid, rigged sardines, mullet, chum blocks', url: 'https://gasparillamarina.com/', publisher: 'Gasparilla Marina' },
    ],
  },
  {
    id: 'safe-harbor-regatta-pointe',
    slug: 'safe-harbor-regatta-pointe',
    name: 'Safe Harbor Regatta Pointe',
    kind: ['marina', 'bait'],
    region: 'Bradenton',
    lat: 27.5099,
    lng: -82.5756,
    address: '1005 Riverside Dr, Palmetto, FL 34221',
    phone: '941-729-6021',
    website: 'https://safeharbor.com/locations/safe-harbor-regatta-pointe/',
    independent: false,
    verification: 'verified',
    carries: [
      'live bait',
      'frozen bait',
      'ice',
      'boat supplies',
      'ValvTect gas and diesel',
      'non-ethanol 90 octane',
    ],
    hours: 'Ship\'s store daily 8am–5pm; marina Mon–Fri 8–5, Sat–Sun 7–5',
    serves: [
      'emerson-point',
      'green-bridge',
      'bradenton-riverwalk',
    ],
    notes: [
      'Part of the national Safe Harbor Marinas group.',
      'Best-documented live bait on the Palmetto side, across the river from Green Bridge and Riverwalk.',
    ],
    sources: [
      { id: 'safeharbor.com', label: 'live bait, frozen bait in the ship’s store; ship’s store daily 8-5', url: 'https://safeharbor.com/locations/safe-harbor-regatta-pointe/', publisher: 'Safe Harbor Marinas' },
    ],
  },
  {
    id: 'st-pete-municipal-marina',
    slug: 'st-pete-municipal-marina',
    name: 'St. Pete Municipal Marina — Ship Store',
    kind: ['marina', 'bait', 'tackle'],
    region: 'St. Petersburg',
    lat: 27.7717,
    lng: -82.6279,
    address: '500 1st Ave. S.E., St. Petersburg, FL 33701',
    phone: '727-893-7329',
    website: 'https://www.stpete.org/residents/parking___transportation/marina.php',
    independent: false,
    verification: 'needs_check',
    carries: [
      'bait including live shrimp',
      'tackle',
      'ValvTect marine fuel',
      'marine diesel',
      '90-octane ethanol-free',
    ],
    hours: '7 days, 8am–5:30pm',
    serves: [
      'st-pete-pier',
      'pass-a-grille-jetty',
    ],
    notes: [
      'City-operated, a short walk from St. Pete Pier.',
      'CONTRADICTION — FWC’s record for the adjacent Demens Landing ramp says "Bait: No" while the City’s own page says live shrimp. FWC data is likely older. Phone-verify.',
      'Redevelopment: construction anticipated 2028, reopening 2031.',
    ],
    sources: [
      { id: 'www.stpete.org', label: 'Bait (including live shrimp) and tackle; 7 days a week, 8am-5:30pm', url: 'https://www.stpete.org/residents/parking___transportation/marina.php', publisher: 'City of St. Petersburg' },
    ],
  },
];

export const shopBySlug = (slug: string): Shop | undefined =>
  SHOPS.find((s) => s.slug === slug);

/** Shops that name `locationSlug` in `serves`, in editorial order. */
export const shopsServing = (locationSlug: string): Shop[] =>
  SHOPS.filter((s) => s.serves.includes(locationSlug));

export const SHOP_KINDS: ShopKind[] = ['tackle', 'bait', 'marina', 'ramp', 'charter'];

export const SHOP_KIND_LABEL: Record<ShopKind, string> = {
  tackle: 'Tackle',
  bait: 'Bait',
  marina: 'Marina',
  ramp: 'Boat ramp',
  charter: 'Charter',
};
