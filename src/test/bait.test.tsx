import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { FISH, LOCATIONS } from '../data';
import { baitIcon, parseBaits } from '../components/species/speciesContent';
import type { BaitIcon } from '../components/species/speciesContent';
import { BAIT_ICON_IDS, BaitGlyph } from '../components/species/art';

/**
 * Bait & lure iconography.
 *
 * `Fish.bait` is free text written for anglers, and `baitIcon()` is the only
 * thing standing between it and a card with a hole in it. The mapping is
 * keyword-based, so it fails *silently* when someone rewords a species' bait
 * line — "cut mullet" becoming "mullet chunks", say. These tests are therefore
 * exhaustive over the real data rather than illustrative: every distinct name
 * the guide actually produces is pinned to the drawing it gets, and the table
 * below must match the data key for key.
 */

/** Every distinct bait card the species pages render today, as `kind|name`. */
function realBaitCards(): Map<string, BaitIcon> {
  const out = new Map<string, BaitIcon>();
  for (const f of FISH) {
    for (const b of parseBaits(f.bait)) out.set(`${b.kind}|${b.name}`, baitIcon(b.name, b.kind));
  }
  return out;
}

/**
 * The expected drawing for every bait card in the shipped data.
 *
 * Update this deliberately when a species' `bait` string changes — that edit is
 * exactly the moment to check the new wording still draws the right thing.
 */
const EXPECTED: Record<string, BaitIcon> = {
  'artificial|3–4 in paddletail': 'softplastic',
  'artificial|bucktail jig': 'jig',
  'artificial|gold spoon/paddletail': 'spoon',
  'artificial|heavy spoon': 'spoon',
  'artificial|jig tipped with shrimp': 'jig',
  'artificial|paddletail/jerk shad': 'softplastic',
  'artificial|pink or chartreuse pompano jig': 'jig',
  'artificial|silver casting spoon': 'spoon',
  'artificial|small jerkbait': 'plug',
  'artificial|small jig tipped with shrimp': 'jig',
  'artificial|small plug': 'plug',
  'artificial|small silver spoon': 'spoon',
  'artificial|topwater plug': 'plug',
  'artificial|white jig': 'jig',
  'natural|Fiddler crab': 'crustacean',
  'natural|Fresh dead shrimp': 'cutbait',
  'natural|Live or cut shrimp': 'cutbait',
  'natural|Live pilchard': 'baitfish',
  'natural|Live shrimp under cork': 'shrimp',
  'natural|Pass crab': 'crustacean',
  'natural|Pilchard': 'baitfish',
  'natural|Sand flea (mole crab)': 'crustacean',
  'natural|Shrimp': 'shrimp',
  'natural|clam strip': 'crustacean',
  'natural|clam': 'crustacean',
  'natural|cut bait': 'cutbait',
  'natural|cut blue crab': 'cutbait',
  'natural|cut mullet': 'cutbait',
  'natural|cut sardine': 'cutbait',
  'natural|fresh shrimp': 'shrimp',
  'natural|live shrimp': 'shrimp',
  'natural|mullet': 'baitfish',
  'natural|pilchard': 'baitfish',
  'natural|pinfish': 'baitfish',
  'natural|sand flea': 'crustacean',
  'natural|scraped barnacle': 'crustacean',
  'natural|shrimp': 'shrimp',
  'natural|small cut baitfish': 'cutbait',
  'natural|threadfin': 'baitfish',
};

describe('bait categorisation over the real data', () => {
  it('covers exactly the bait cards the species pages render — no more, no less', () => {
    expect([...realBaitCards().keys()].sort()).toEqual(Object.keys(EXPECTED).sort());
  });

  it('draws every real bait card as expected', () => {
    for (const [card, icon] of realBaitCards()) {
      expect(icon, `${card} is drawn as "${icon}"`).toBe(EXPECTED[card]);
    }
  });

  it('never falls back to a generic shape for a bait the guide actually lists', () => {
    for (const [card, icon] of realBaitCards()) {
      expect(['natural', 'artificial'], `${card} fell through the keyword table`).not.toContain(
        icon,
      );
    }
  });

  it('also recognises every bait/lure named in a location target recipe', () => {
    // Same vocabulary, written by the same hand, and the obvious next place
    // these icons get reused — so it is worth failing here first.
    for (const l of LOCATIONS) {
      for (const t of l.targets) {
        const icon = baitIcon(t.bait, 'natural');
        expect(['natural', 'artificial'], `${l.slug}: "${t.bait}" is unrecognised`).not.toContain(
          icon,
        );
      }
    }
  });
});

describe('bait categorisation rules', () => {
  it('draws a compound choice as whatever leads it', () => {
    expect(baitIcon('gold spoon/paddletail', 'artificial')).toBe('spoon');
    expect(baitIcon('paddletail/jerk shad', 'artificial')).toBe('softplastic');
    expect(baitIcon('silver spoon/white jig', 'artificial')).toBe('spoon');
    expect(baitIcon('plug/jig', 'artificial')).toBe('plug');
    expect(baitIcon('sand flea/shrimp', 'natural')).toBe('crustacean');
    expect(baitIcon('shrimp/crab', 'natural')).toBe('shrimp');
  });

  it('does not draw a cut or dead bait as a live one', () => {
    expect(baitIcon('cut mullet', 'natural')).toBe('cutbait');
    expect(baitIcon('cut bait', 'natural')).toBe('cutbait');
    expect(baitIcon('dead shrimp', 'natural')).toBe('cutbait');
    expect(baitIcon('ladyfish chunk', 'natural')).toBe('cutbait');
    expect(baitIcon('mullet', 'natural')).toBe('baitfish');
  });

  it('ignores case and surrounding wording', () => {
    expect(baitIcon('Live shrimp under cork', 'natural')).toBe('shrimp');
    expect(baitIcon('WEEDLESS PADDLETAIL', 'artificial')).toBe('softplastic');
    expect(baitIcon('3–4 in paddletail', 'artificial')).toBe('softplastic');
    expect(baitIcon('1/4 oz jig head', 'artificial')).toBe('jig');
  });

  it('falls back to the right generic shape, never to nothing', () => {
    expect(baitIcon('something nobody has written yet', 'natural')).toBe('natural');
    expect(baitIcon('something nobody has written yet', 'artificial')).toBe('artificial');
    expect(baitIcon('', 'natural')).toBe('natural');
  });
});

describe('bait illustrations', () => {
  it('has a drawing for every category the categoriser can return', () => {
    const reachable = new Set<BaitIcon>(['natural', 'artificial']);
    for (const icon of realBaitCards().values()) reachable.add(icon);
    for (const l of LOCATIONS) for (const t of l.targets) reachable.add(baitIcon(t.bait, 'natural'));
    for (const icon of reachable) expect(BAIT_ICON_IDS).toContain(icon);
  });

  it('renders a non-empty, decorative SVG for every category', () => {
    for (const icon of BAIT_ICON_IDS) {
      const { container, unmount } = render(<BaitGlyph icon={icon} />);
      const svg = container.querySelector('svg');
      expect(svg, `${icon} rendered no svg`).not.toBeNull();
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      expect(svg!.children.length, `${icon} rendered an empty svg`).toBeGreaterThan(0);
      unmount();
    }
  });

  it('leaves no blank swatch on any species page', () => {
    for (const fish of FISH) {
      const { container, unmount } = render(
        <MemoryRouter initialEntries={[`/fish/${fish.id}`]}>
          <App />
        </MemoryRouter>,
      );
      const swatches = [...container.querySelectorAll('.bait .swatch')];
      expect(swatches.length, `${fish.id} renders no bait cards`).toBe(
        parseBaits(fish.bait).length,
      );
      for (const s of swatches) {
        expect(s.querySelector('svg'), `${fish.id} has an empty bait swatch`).not.toBeNull();
      }
      unmount();
    }
  });
});
