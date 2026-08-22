/**
 * Free / paid capability model.
 *
 * ONE THING TO UNDERSTAND BEFORE USING ANY OF THIS.
 *
 * The guide is an offline-first PWA: every location, species, rig and care
 * page is compiled into the JavaScript bundle so the app works with no signal.
 * That is its best feature and it is fundamentally at odds with paywalling
 * content, because anything in the bundle is already on the reader's device.
 * A gate here hides content; it does not withhold it. Anyone who opens
 * devtools can read all of it.
 *
 * So be honest about what this layer is: **an upsell and packaging mechanism,
 * not access control.** It is the right tool for "free shows 8 spots, paid
 * shows 25" and the wrong tool for anything whose leak would actually cost
 * money. Rate-limited paid calls are the real exception, and those are already
 * enforced server-side where they belong — `identify-fish` counts requests in
 * Postgres before it spends anything on the model, and no client flag can
 * unlock that.
 *
 * When soft gating stops being good enough, the upgrade path is deliberate:
 * move premium content out of the bundle and fetch it after an entitlement
 * check, caching it for offline afterwards. Everything in this file is shaped
 * so that becomes a change of loader, not a rewrite of every screen — which is
 * exactly why capabilities are declared as data here rather than as `if`
 * statements scattered through components.
 */

export type Tier = 'free' | 'paid';

/** How a capability is gated. */
export type GateKind =
  /** On or off for a tier. */
  | 'boolean'
  /** Available to both, but capped for one. `null` limit means uncapped. */
  | 'limit';

export interface Capability {
  /** Stable key. Persisted in config and in the admin UI — never rename casually. */
  id: string;
  /** What the owner sees in the admin screen. */
  label: string;
  /** Why someone would pay for it, in one line. */
  description: string;
  group: 'Content' | 'Live data' | 'Tools' | 'Experience';
  kind: GateKind;
  /** For 'limit': what the number counts, e.g. "spots". */
  unit?: string;
  /** Shipped default for free. `false`, or a numeric cap. */
  free: boolean | number | null;
  /** Shipped default for paid. */
  paid: boolean | number | null;
  /**
   * True when the gate is enforced somewhere the client cannot forge — a
   * server-side rate limit or a fetch that requires entitlement. False means
   * soft: good for packaging, useless against a determined reader.
   */
  enforced: boolean;
  /** Why this is a reasonable thing to charge for, or a warning about gating it. */
  note?: string;
}

/**
 * Every gateable capability in the app.
 *
 * This registry IS the product's packaging. Adding a feature without adding it
 * here means it silently ships to everyone, so `src/test/entitlements.test.ts`
 * checks the ids stay unique and the defaults stay coherent.
 */
export const CAPABILITIES: Capability[] = [
  // ---------------------------------------------------------------- Content
  {
    id: 'locations.count',
    label: 'Fishing spots',
    description: 'How many of the 25 researched spots are browsable.',
    group: 'Content', kind: 'limit', unit: 'spots',
    free: 8, paid: null, enforced: false,
    note: 'The strongest free-tier hook: enough spots to prove the research is real, few enough that a local runs out. Keep the free set geographically spread, or a reader in Englewood sees nothing near them and leaves.',
  },
  {
    id: 'fish.count',
    label: 'Species pages',
    description: 'How many of the 11 documented species have full pages.',
    group: 'Content', kind: 'limit', unit: 'species',
    free: 4, paid: null, enforced: false,
    note: 'Keep snook, redfish and trout free — they are what people search for. Gate the specialist ones.',
  },
  {
    id: 'care.full',
    label: 'Handle With Care — full guidance',
    description: 'Safe-handling detail for the six species that injure people.',
    group: 'Content', kind: 'boolean',
    free: true, paid: true, enforced: false,
    note: 'NEVER GATE THIS. Someone grabs a catfish or a stingray whether or not they paid. Putting injury-avoidance behind a paywall is indefensible and it is the one gate that could genuinely hurt a person.',
  },
  {
    id: 'rigs.full',
    label: 'Rig & knot school',
    description: 'Every rig and knot walkthrough.',
    group: 'Content', kind: 'boolean',
    free: false, paid: true, enforced: false,
  },
  {
    id: 'shops.directory',
    label: 'Tackle & bait directory',
    description: 'Where to buy bait near each spot.',
    group: 'Content', kind: 'boolean',
    free: true, paid: true, enforced: false,
    note: 'Keep free. It carries the sponsor inventory, so gating it would shrink the audience the sponsors are paying to reach.',
  },

  // -------------------------------------------------------------- Live data
  {
    id: 'conditions.live',
    label: 'Live tide & weather',
    description: 'Current NOAA tide stage and NWS forecast per spot.',
    group: 'Live data', kind: 'boolean',
    free: true, paid: true, enforced: false,
    note: 'Free. It is what brings people back daily, and daily returns are what sell everything else.',
  },
  {
    id: 'forecast.days',
    label: 'Forecast range',
    description: 'How many days ahead of tide and weather are shown.',
    group: 'Live data', kind: 'limit', unit: 'days',
    free: 1, paid: 7, enforced: false,
    note: 'The cleanest paid split in the app: today is free, planning the weekend is paid. Needs the widened refresh window to be real.',
  },
  {
    id: 'tides.explorer',
    label: 'Tide explorer',
    description: 'Browse any station, any date, full curve.',
    group: 'Tools', kind: 'boolean',
    free: false, paid: true, enforced: false,
    note: 'Careful: "tide chart bradenton" is the highest-intent keyword found in research. Gate the explorer, but keep a free, indexable per-spot tide page or the SEO play dies.',
  },

  // ------------------------------------------------------------------ Tools
  {
    id: 'identify.perDay',
    label: 'Photo fish ID',
    description: 'Identifications allowed per day.',
    group: 'Tools', kind: 'limit', unit: 'per day',
    free: 2, paid: 20, enforced: true,
    note: 'The one gate with real teeth, because it is enforced in Postgres before the paid model call. Each ID costs about $0.026, so this is a genuine cost control, not packaging.',
  },
  {
    id: 'nearby.ranking',
    label: 'Spots near you',
    description: 'Ranks spots by distance and researched conditions.',
    group: 'Tools', kind: 'boolean',
    free: true, paid: true, enforced: false,
    note: 'Free. It is the best demonstration of what the research buys, and it sells the paid tier better than hiding it would.',
  },
  {
    id: 'planner.windows',
    label: 'Best-window planner',
    description: 'Ranked fishing windows across the forecast.',
    group: 'Tools', kind: 'boolean',
    free: false, paid: true, enforced: false,
    note: 'Not built yet — see docs/OPS_BACKLOG.md item 3. The clearest premium feature on the roadmap.',
  },

  // ------------------------------------------------------------- Experience
  {
    id: 'ads.enabled',
    label: 'Show ads',
    description: 'Sponsored placements appear in this tier.',
    group: 'Experience', kind: 'boolean',
    free: true, paid: false, enforced: false,
    note: 'Inverted by design: true for free, false for paid. Removing ads is the paid benefit. Sponsored items always carry their label regardless — see lib/sponsorship.ts.',
  },
  {
    id: 'offline.full',
    label: 'Full offline guide',
    description: 'Everything works with no signal.',
    group: 'Experience', kind: 'boolean',
    free: true, paid: true, enforced: false,
    note: 'Do not gate. It is the product\'s defining feature and the reason it beats bigger apps on the water.',
  },
];

export const capabilityById = (id: string): Capability | undefined =>
  CAPABILITIES.find((c) => c.id === id);

/** The shipped matrix, used offline and whenever remote config is unavailable. */
export type EntitlementMatrix = Record<string, { free: boolean | number | null; paid: boolean | number | null }>;

export const DEFAULT_MATRIX: EntitlementMatrix = Object.fromEntries(
  CAPABILITIES.map((c) => [c.id, { free: c.free, paid: c.paid }]),
);

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const asValue = (v: unknown): boolean | number | null | undefined => {
  if (typeof v === 'boolean' || v === null) return v;
  if (typeof v === 'number' && Number.isFinite(v)) return Math.max(0, Math.floor(v));
  return undefined;
};

/**
 * Merges owner-configured overrides onto the shipped matrix.
 *
 * Total: an unknown key, a malformed value or a hostile payload is ignored and
 * the shipped default stands. A broken config must never silently open or
 * close a gate — least of all `care.full`.
 */
export function mergeMatrix(remote: unknown, base: EntitlementMatrix = DEFAULT_MATRIX): EntitlementMatrix {
  if (!isRecord(remote)) return base;
  const out: EntitlementMatrix = { ...base };
  for (const c of CAPABILITIES) {
    const row = remote[c.id];
    if (!isRecord(row)) continue;
    const free = asValue(row.free);
    const paid = asValue(row.paid);
    out[c.id] = {
      free: free === undefined ? base[c.id].free : free,
      paid: paid === undefined ? base[c.id].paid : paid,
    };
  }
  return out;
}

/** Is this capability on for `tier`? For 'limit' capabilities, a cap above 0 counts as on. */
export function can(matrix: EntitlementMatrix, id: string, tier: Tier): boolean {
  const v = matrix[id]?.[tier];
  if (typeof v === 'boolean') return v;
  if (v === null) return true;
  if (typeof v === 'number') return v > 0;
  return false;
}

/** The cap for a 'limit' capability. `null` = uncapped. */
export function limitOf(matrix: EntitlementMatrix, id: string, tier: Tier): number | null {
  const v = matrix[id]?.[tier];
  if (typeof v === 'number') return v;
  return null;
}

/** Applies a cap to a list. Uncapped returns the list untouched. */
export function capList<T>(items: T[], matrix: EntitlementMatrix, id: string, tier: Tier): T[] {
  const n = limitOf(matrix, id, tier);
  return n === null ? items : items.slice(0, Math.max(0, n));
}
