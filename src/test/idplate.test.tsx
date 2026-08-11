import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { IdPlate } from '../components/ui';
import {
  GUTTER,
  PHOTO_ASPECT,
  PHOTO_INSET_Y_PCT,
  PLATE_ASPECT,
  PLATE_H,
  placeMarks,
} from '../components/ui/idPlateGeometry';
import { SPECIES_CONTENT } from '../components/species/speciesContent';

/**
 * ID plate callout geometry.
 *
 * There is no browser in this environment to look at the plates in, and
 * "looks fine to me" is how the tarpon marks ended up mirrored onto the wrong
 * side of a fish once already. So the layout is a pure function and this suite
 * checks it arithmetically, for every mark of every species in the guide:
 *
 *   a. every numbered pin sits inside the plate with room for its own disc,
 *   b. no two pins on the same plate touch,
 *   c. every leader line ends exactly on the feature coordinate the species
 *      data authored — the pin moved, the point it names did not,
 *   d. no pin lands on the photograph, which is the entire reason for the
 *      change.
 *
 * Sizes below are the rendered pin in pages.css. The binding case is the
 * narrowest plate the app can produce: a 320px phone, less the 16px page
 * padding on each side, is a 288px plate.
 */

const PIN_PX = 24;
const PIN_RING_PX = 1.5;
const PIN_R = PIN_PX / 2 + PIN_RING_PX; // 13.5px outer radius
const DOT_R = 3.5 + 0.75; // feature dot: r=3.5 plus half its 1.5px stroke
const LEAD_HALF = 1.5; // half the leader's dark casing
const NARROW_PLATE_PX = 288;

interface Pt {
  x: number;
  y: number;
}

/** Distance from a point to a line segment. */
function distToSegment(p: Pt, a: Pt, b: Pt): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = dx * dx + dy * dy;
  const t = len === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len));
  return Math.hypot(a.x + t * dx - p.x, a.y + t * dy - p.y);
}

function segmentsCross(a: Pt, b: Pt, c: Pt, d: Pt): boolean {
  const side = (p: Pt, q: Pt, r: Pt) =>
    Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x));
  return side(a, b, c) !== side(a, b, d) && side(c, d, a) !== side(c, d, b);
}

type Species = keyof typeof SPECIES_CONTENT;
const species = Object.keys(SPECIES_CONTENT) as Species[];

/** Every mark in the guide, as (species, marks) pairs. */
const plates = species
  .map((id) => [id, SPECIES_CONTENT[id].marks] as const)
  .filter(([, marks]) => marks.length > 0);

const totalMarks = plates.reduce((n, [, marks]) => n + marks.length, 0);

/** Percentages of the plate box -> pixels, at a given plate width. */
function toPx(pctX: number, pctY: number, plateW: number) {
  return { x: (pctX / 100) * plateW, y: (pctY / 100) * (plateW * PLATE_H) };
}

describe('ID plate callout geometry', () => {
  it('covers every species plate in the guide', () => {
    expect(plates.length).toBe(11);
    // 11 species: snook and redfish carry five marks, the other nine carry four.
    expect(totalMarks).toBe(46);
  });

  it.each(plates)('%s: keeps every pin inside the plate', (_id, marks) => {
    for (const plateW of [NARROW_PLATE_PX, 358, 640]) {
      const plateH = plateW * PLATE_H;
      for (const p of placeMarks(marks)) {
        const { x, y } = toPx(p.px, p.py, plateW);
        expect(x).toBeGreaterThanOrEqual(PIN_R);
        expect(x).toBeLessThanOrEqual(plateW - PIN_R);
        expect(y).toBeGreaterThanOrEqual(PIN_R);
        expect(y).toBeLessThanOrEqual(plateH - PIN_R);
      }
    }
  });

  it.each(plates)('%s: never puts two pins on top of each other', (_id, marks) => {
    // Worst case is the narrowest plate: the pin is a fixed pixel size, so it
    // is relatively largest there.
    const placed = placeMarks(marks).map((p) => toPx(p.px, p.py, NARROW_PLATE_PX));
    for (let i = 0; i < placed.length; i += 1) {
      for (let j = i + 1; j < placed.length; j += 1) {
        const d = Math.hypot(placed[i].x - placed[j].x, placed[i].y - placed[j].y);
        expect(d).toBeGreaterThan(2 * PIN_R + 2);
      }
    }
  });

  it.each(plates)('%s: lands every leader line on its authored feature', (_id, marks) => {
    const placed = placeMarks(marks);
    marks.forEach((m, i) => {
      const p = placed[i];
      expect(p.n).toBe(m.n);
      // Undo the plate -> photo mapping: what comes back must be the exact
      // coordinate speciesContent.ts authored for this feature.
      const u = (p.fx / 100 - GUTTER) / (1 - 2 * GUTTER);
      const v = ((p.fy / 100) * PLATE_H - GUTTER) / (PLATE_H - 2 * GUTTER);
      expect(u * 100).toBeCloseTo(Number.parseFloat(m.left), 2);
      expect(v * 100).toBeCloseTo(Number.parseFloat(m.top), 2);
    });
  });

  it.each(plates)('%s: keeps every pin off the photograph', (_id, marks) => {
    for (const p of placeMarks(marks)) {
      const insideX = p.px > GUTTER * 100 && p.px < 100 - GUTTER * 100;
      const insideY = p.py > PHOTO_INSET_Y_PCT && p.py < 100 - PHOTO_INSET_Y_PCT;
      expect(insideX && insideY).toBe(false);
    }
  });

  it.each(plates)('%s: gives every leader line something to draw', (_id, marks) => {
    for (const p of placeMarks(marks)) {
      const a = toPx(p.fx, p.fy, NARROW_PLATE_PX);
      const b = toPx(p.px, p.py, NARROW_PLATE_PX);
      // Long enough to read as a line reaching in from the margin, not a smudge
      // under the pin.
      expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(PIN_R + 4);
    }
  });

  it.each(plates)('%s: routes leaders clear of the other marks', (_id, marks) => {
    const placed = placeMarks(marks).map((p) => ({
      n: p.n,
      dot: toPx(p.fx, p.fy, NARROW_PLATE_PX),
      pin: toPx(p.px, p.py, NARROW_PLATE_PX),
    }));
    for (const a of placed) {
      for (const b of placed) {
        if (a.n === b.n) continue;
        // A leader that runs under someone else's number, or through someone
        // else's feature dot, reads as pointing at the wrong thing.
        expect(distToSegment(b.pin, a.dot, a.pin)).toBeGreaterThan(PIN_R + 2);
        expect(distToSegment(b.dot, a.dot, a.pin)).toBeGreaterThan(DOT_R + LEAD_HALF);
      }
    }
    // Two leaders that cross make it ambiguous which number owns which point.
    for (let i = 0; i < placed.length; i += 1) {
      for (let j = i + 1; j < placed.length; j += 1) {
        expect(
          segmentsCross(placed[i].dot, placed[i].pin, placed[j].dot, placed[j].pin),
        ).toBe(false);
      }
    }
  });

  it('is stable — the same marks always place the same way', () => {
    const marks = SPECIES_CONTENT.snook.marks;
    expect(placeMarks(marks)).toEqual(placeMarks([...marks]));
  });

  it('places a single mark, and marks stacked on one point, without blowing up', () => {
    expect(placeMarks([{ n: 1, left: '50%', top: '50%' }])).toHaveLength(1);
    const stacked = placeMarks([
      { n: 1, left: '50%', top: '50%' },
      { n: 2, left: '50%', top: '50%' },
      { n: 3, left: '50%', top: '50%' },
    ]).map((p) => toPx(p.px, p.py, NARROW_PLATE_PX));
    for (let i = 0; i < stacked.length; i += 1) {
      for (let j = i + 1; j < stacked.length; j += 1) {
        const d = Math.hypot(stacked[i].x - stacked[j].x, stacked[i].y - stacked[j].y);
        expect(d).toBeGreaterThan(2 * PIN_R + 2);
      }
    }
  });
});

describe('ID plate CSS', () => {
  const css = readFileSync(resolve(import.meta.dirname, '../styles/pages.css'), 'utf8');

  it('lays the plate out with the same numbers the geometry computes', () => {
    // 10% gutter around a 3:2 photo == a 15/11 plate whose gutter is 13.636%
    // of its height. If the module changes, these have to change with it.
    expect(GUTTER).toBe(0.1);
    expect(PHOTO_ASPECT).toBe(1.5);
    expect(PLATE_ASPECT).toBeCloseTo(15 / 11, 6);
    expect(PHOTO_INSET_Y_PCT).toBeCloseTo(13.636, 3);
    expect(css).toContain('aspect-ratio:15/11');
    expect(css).toContain('left:10%;right:10%;top:13.636%;bottom:13.636%');
    expect(css).toContain(`width:${PIN_PX}px;height:${PIN_PX}px`);
    expect(css).toContain(`box-shadow:0 0 0 ${PIN_RING_PX}px`);
  });

  it('no longer styles a caption bar over the plate', () => {
    expect(css).not.toContain('.idplate .cap');
  });
});

describe('IdPlate rendering', () => {
  const marks = SPECIES_CONTENT.snook.marks;

  it('draws a numbered pin, a leader and a feature dot for every mark', () => {
    const { container } = render(
      <IdPlate media={{ url: 'https://example.test/snook.jpg', alt: 'Snook' }} marks={marks} />,
    );
    expect(container.querySelectorAll('.idplate .mark')).toHaveLength(marks.length);
    expect(container.querySelectorAll('.idleaders .lead')).toHaveLength(marks.length);
    expect(container.querySelectorAll('.idleaders .lead-dot')).toHaveLength(marks.length);
    expect(container.querySelector('.idphoto img')).toBeTruthy();
  });

  it('positions the pin where the geometry says, not on the feature', () => {
    const { container } = render(<IdPlate media={null} marks={marks} />);
    const placed = placeMarks(marks);
    const pins = container.querySelectorAll<HTMLElement>('.idplate .mark');
    placed.forEach((p, i) => {
      expect(pins[i].textContent).toBe(String(p.n));
      expect(pins[i].style.left).toBe(`${p.px}%`);
      expect(pins[i].style.top).toBe(`${p.py}%`);
      // The old behaviour — the pin's own box sat on the feature point — must
      // not come back. (One axis may legitimately match: a mark dead centre
      // horizontally gets a pin straight above or below it.)
      expect(`${p.px},${p.py}`).not.toBe(`${p.fx},${p.fy}`);
    });
  });

  it('renders no caption chip and keeps the marks described for screen readers', () => {
    const { container } = render(<IdPlate media={null} marks={marks} />);
    expect(container.querySelector('.cap')).toBeNull();
    expect(container.querySelector('figcaption')?.textContent).toContain(marks[0].title);
  });

  it('falls back to the empty photo slot with no media', () => {
    const { container } = render(<IdPlate media={null} marks={[]} />);
    expect(container.querySelector('.idphoto--empty')).toBeTruthy();
    expect(container.querySelector('.idleaders')).toBeNull();
  });
});
