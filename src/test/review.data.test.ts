import { describe, expect, it } from 'vitest';
import ITEMS from '../admin/data/review-items.json';
import type { ReviewItem } from '../admin/review-types';
import { LOCATIONS } from '../data/locations';

/**
 * Integrity of the review queue.
 *
 * These items are transcribed from research prose by an agent, and the queue
 * is only worth using if every row can be traced back to something checkable.
 * The two failure modes that matter: an id that drifts between regenerations
 * (which orphans the owner's decision, silently resetting work already done),
 * and a claim with no source (which is the exact thing the guide's content
 * rule exists to prevent).
 */

const items = ITEMS as ReviewItem[];
const slugs = new Set(LOCATIONS.map((l) => l.slug));

const KINDS = ['access_note','safety','seasons','daypart','source','shop','alert','permit'];
const CONFIDENCE = ['high', 'medium', 'insufficient'];

describe('review items', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  it('has unique ids', () => {
    const ids = items.map((i) => i.id);
    const dupes = ids.filter((id, n) => ids.indexOf(id) !== n);
    expect(dupes, `Duplicate ids orphan decisions:\n${[...new Set(dupes)].join('\n')}`).toEqual([]);
  });

  it('uses only known kinds and confidence levels', () => {
    const bad = items.filter((i) => !KINDS.includes(i.kind) || !CONFIDENCE.includes(i.confidence));
    expect(bad.map((i) => `${i.id}: ${i.kind}/${i.confidence}`)).toEqual([]);
  });

  it('carries every required field, non-empty', () => {
    const bad: string[] = [];
    for (const i of items) {
      if (!i.id || !i.target || !i.target_label || !i.proposed?.trim() || !i.origin) {
        bad.push(i.id ?? '(no id)');
      }
      if (typeof i.time_sensitive !== 'boolean' || typeof i.urgent !== 'boolean') {
        bad.push(`${i.id} (bad flags)`);
      }
    }
    expect(bad).toEqual([]);
  });

  /**
   * Anything targeting a location must name a real one, or the accepted text
   * has nowhere to go on export and the item silently disappears.
   */
  it('targets a real location slug, a shop, or GUIDE', () => {
    const locationKinds = ['access_note', 'safety', 'seasons', 'daypart', 'source'];
    const bad = items
      .filter((i) => locationKinds.includes(i.kind))
      .filter((i) => i.target !== 'GUIDE' && !slugs.has(i.target))
      .map((i) => `${i.id} -> ${i.target}`);
    expect(bad, `Unknown location slug:\n${bad.join('\n')}`).toEqual([]);
  });

  it('gives every source a url and a verbatim quote', () => {
    const bad: string[] = [];
    for (const i of items) {
      for (const s of i.sources ?? []) {
        if (!s.url?.startsWith('http')) bad.push(`${i.id}: bad url ${s.url}`);
        if (!s.quote?.trim()) bad.push(`${i.id}: source with no quote (${s.url})`);
      }
    }
    expect(bad).toEqual([]);
  });

  /**
   * A claim with no source is allowed onto the queue — an honest gap is a
   * valid research result — but it must be labelled `insufficient` so the
   * review screen shows it in red rather than presenting it as researched.
   */
  it('marks unsourced claims as insufficient', () => {
    const bad = items
      .filter((i) => (i.sources?.length ?? 0) === 0 && i.confidence !== 'insufficient')
      .map((i) => `${i.id} (${i.confidence})`);
    expect(bad, `Unsourced but not marked insufficient:\n${bad.join('\n')}`).toEqual([]);
  });

  it('flags the corrections we know about as urgent', () => {
    const urgent = items.filter((i) => i.urgent);
    expect(urgent.length).toBeGreaterThan(0);
    // The guide is currently wrong about these two; if either stops being
    // urgent, something has quietly reclassified a real-world closure.
    const targets = new Set(urgent.map((i) => i.target));
    expect(targets.has('emerson-point')).toBe(true);
    expect(targets.has('green-bridge')).toBe(true);
  });
});
