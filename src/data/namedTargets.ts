import { LOCATIONS } from './locations';
import type { Location } from './types';

/**
 * Species this guide **names** but does not **document**.
 *
 * Five of the eleven species that appear in the researched location data have
 * no species page: the guide lists them as targets at real spots, with a rig,
 * hook, leader, weight and bait for each spot, but there is no /fish/<id> page
 * behind them. That is a deliberate gap, not an oversight — a species page
 * carries identification marks, tackle, and release handling, and none of that
 * has been researched for these five. Writing it from general knowledge would
 * break the guide's own rule: never invent fishing content.
 *
 * They still matter to photo ID. A sheepshead is one of the most commonly
 * caught fish on every dock and bridge in this footprint, and an identifier
 * that can only answer with five species is wrong far more often than it needs
 * to be. So these are recognised and named — and the result says plainly that
 * there is no page for them yet, then sends the reader to the location that
 * *does* carry a researched recipe for that species.
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
    id: 'sheepshead',
    name: 'Sheepshead',
    labels: ['Sheepshead'],
    scope:
      'Sheepshead (Archosargus probatocephalus) — deep silver body with bold black vertical bars and human-like incisor teeth.',
  },
  {
    id: 'pompano',
    name: 'Pompano',
    labels: ['Pompano'],
    scope:
      'Florida pompano (Trachinotus carolinus) — deep, flat, blunt-headed silver fish with a yellow belly and throat, and a deeply forked tail.',
  },
  {
    id: 'jack',
    name: 'Jack',
    labels: ['Jack'],
    scope:
      'Jack crevalle and the other inshore jacks — deep blunt head, steep forehead, hard scutes along the tail base, black spot on the gill cover and pectoral fin.',
  },
  {
    // The location data uses both labels for the same fish: "Mackerel" on a
    // spoon behind a bite leader, at the same passes and beaches where it also
    // says "Spanish mackerel". Where it means the larger fish it says
    // "Kingfish", and one location's safety note names the two separately.
    id: 'spanish-mackerel',
    name: 'Spanish mackerel',
    labels: ['Spanish mackerel', 'Mackerel'],
    scope:
      'Spanish mackerel (Scomberomorus maculatus) — slender silver body with scattered round yellow-bronze spots and no bars; smaller and shorter than a king mackerel.',
  },
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
