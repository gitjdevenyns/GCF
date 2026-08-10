/**
 * Per-hazard editorial for the Handle With Care screen.
 *
 * PROVENANCE
 * ----------
 * `risk` and `handle` come straight from `src/data/hazards.ts` and are rendered
 * verbatim — this module never restates them. What it adds is the "how to know
 * it" block and the one-line framing, both ported from design board
 * "05 Handle With Care", which is the authored source for this screen. Each
 * identification note describes only visible features of the animal.
 *
 * `kind` classifies each hazard from its own `risk` text:
 *   spine — the injury mechanism is a venomous/venom-associated spine
 *   bite  — the injury mechanism is teeth
 *   toxin — the animal is not dangerous to handle; the danger is eating it
 * The chip is labelled in words as well as coloured, so the category never
 * depends on colour alone.
 */

export type HazardKind = 'spine' | 'bite' | 'toxin';

export interface HazardContent {
  kind: HazardKind;
  /** Words on the chip — the mechanism, not a severity rating. */
  kindLabel: string;
  /** One line of framing under the name. */
  framing: string;
  /** Visible identification features. */
  identify: string;
}

export const HAZARD_CONTENT: Record<string, HazardContent> = {
  catfish: {
    kind: 'spine',
    kindLabel: 'Venomous spines',
    framing: 'The one you will actually meet. Common, and completely manageable.',
    identify:
      'Flattened head, small eyes, and barbels trailing from the mouth. The gafftopsail carries a tall, sail-like first dorsal fin with long trailing filaments; the hardhead is plainer, and far more common.',
  },
  stingray: {
    kind: 'spine',
    kindLabel: 'Venomous tail spine',
    framing: 'Usually met underfoot rather than on the end of a line.',
    identify:
      'A flat diamond disc with the eyes on top and a whip-like tail. Most of the time you never see the animal at all — just a ray-shaped depression in the sand of a pothole.',
  },
  lionfish: {
    kind: 'spine',
    kindLabel: 'Venomous fin spines',
    framing: 'Non-native. The one animal here we ask you to remove.',
    identify:
      'Unmistakable: a boldly banded body behind a long fan of separated spines. There is nothing native inshore that looks remotely like it.',
  },
  barracuda: {
    kind: 'bite',
    kindLabel: 'Severe bite',
    framing: 'Calm in the water, unpredictable out of it.',
    identify:
      'A long silver torpedo with an underslung jaw, scattered dark blotches along the flank, and teeth you can see before the fish is anywhere near the boat.',
  },
  sharks: {
    kind: 'bite',
    kindLabel: 'Bite + legal ID',
    framing: 'A safety question and a legal one at the same time.',
    identify:
      'Juvenile inshore sharks look a great deal alike, and several species are protected. If you cannot name it to species, treat it as one you are not allowed to land.',
  },
  pufferfish: {
    kind: 'toxin',
    kindLabel: 'Toxin if eaten',
    framing: 'Harmless to hold, dangerous to cook.',
    identify:
      'Small and blunt, with a beak-like mouth, and it inflates when stressed. Easy to identify — which is exactly why the danger is not identification.',
  },
};

export const hazardContent = (id: string): HazardContent | undefined => HAZARD_CONTENT[id];

/** The three habits that cover almost every injury on this page. */
export const SAFE_HANDLING_RULES = [
  {
    n: 1,
    title: 'Tools, not fingers.',
    body: 'Long pliers and a dehooker live in the bag, not at home. Nearly every injury on this page happens because somebody reached instead of reaching for a tool.',
  },
  {
    n: 2,
    title: 'Leave it in the water.',
    body: 'A fish you never lift cannot spike you — and it is also the fish most likely to swim off properly afterwards. The safe move and the right move are the same move.',
  },
  {
    n: 3,
    title: 'If you cannot name it, do not hold it.',
    body: 'Cut the leader close to the hook and let it go. An animal you cannot identify is a legal question as well as a safety one.',
  },
];
