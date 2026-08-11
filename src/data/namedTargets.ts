import { LOCATIONS } from './locations';
import type { Location } from './types';

/**
 * Species this guide **names** but does not **document**.
 *
 * Sheepshead, pompano, jack crevalle and Spanish mackerel used to live here —
 * they now have real species pages in `fish.ts`, sourced the same way as the
 * original five. Kingfish is the one label left: the guide's own safety notes
 * distinguish it from Spanish mackerel at the same spots, but nobody has
 * researched king mackerel tackle and handling for this coast yet. That is a
 * deliberate gap, not an oversight — a species page carries identification
 * marks, tackle, and release handling, and none of that exists for kingfish.
 * Writing it from general knowledge would break the guide's own rule: never
 * invent fishing content.
 *
 * It still matters to photo ID. Someone who lands one needs an honest answer,
 * not silence — so it is recognised and named, and the result says plainly
 * that there is no page for it yet, then sends the reader to the location
 * that *does* carry a researched recipe for it (as a Spanish mackerel
 * target, since that is the only kingfish-adjacent tackle this guide has).
 *
 * Nothing here is new fishing content. `name` is the guide's own label,
 * verbatim. `labels` are the exact `species_label` strings already present in
 * locations.ts. `scope` exists only to tell the identification model which
 * animal an id covers, and says no more than the location data already implies.
 *
 * `src/test/identify.data.test.ts` asserts both directions: every label here
 * appears in the location data, and every species named in the location data is
 * either a documented species or covered here. Adding a location that names a
 * new species therefore fails the build until that species is either given a
 * page or listed here.
 */
export interface NamedTarget {
  /** Stable id, also the value the identification model may return. */
  id: string;
  /** The guide's own label for it. Not a species-level claim the data doesn't make. */
  name: string;
  /** Every `species_label` in locations.ts this id covers. */
  labels: string[];
  /** What the id covers, for the identification model. */
  scope: string;
}

export const NAMED_TARGETS: NamedTarget[] = [
  {
    id: 'kingfish',
    name: 'Kingfish',
    labels: ['Kingfish'],
    scope:
      'King mackerel / kingfish (Scomberomorus cavalla) — long silver mackerel with a dipped lateral line and, on adults, no spots. This guide means the mackerel, not the whiting sometimes called a kingfish elsewhere.',
  },
];

export const namedTargetById = (id: string): NamedTarget | undefined =>
  NAMED_TARGETS.find((t) => t.id === id);

/** Every species_label the guide covers with a named target rather than a page. */
export const NAMED_TARGET_LABELS: ReadonlySet<string> = new Set(
  NAMED_TARGETS.flatMap((t) => t.labels),
);

/**
 * The guide locations that name this species as a target, in the order they
 * appear in the data (north to south). These are what the photo-ID result links
 * to: each one carries a researched rig, hook, leader, weight and bait for this
 * species at that spot, which is the closest thing the guide has to a page.
 */
export function locationsNaming(target: NamedTarget): Location[] {
  return LOCATIONS.filter((l) => l.targets.some((t) => target.labels.includes(t.species_label)));
}
