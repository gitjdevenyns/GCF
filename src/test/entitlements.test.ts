import { describe, expect, it } from 'vitest';
import {
  CAPABILITIES, DEFAULT_MATRIX, can, capList, limitOf, mergeMatrix,
} from '../lib/entitlements';

describe('capability registry', () => {
  it('has unique ids', () => {
    const ids = CAPABILITIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives limit capabilities a unit, and boolean ones boolean defaults', () => {
    for (const c of CAPABILITIES) {
      if (c.kind === 'limit') {
        expect(c.unit, `${c.id} is a limit and needs a unit`).toBeTruthy();
        for (const v of [c.free, c.paid]) {
          expect(v === null || typeof v === 'number', `${c.id} limit default`).toBe(true);
        }
      } else {
        expect(typeof c.free, `${c.id} free`).toBe('boolean');
        expect(typeof c.paid, `${c.id} paid`).toBe('boolean');
      }
    }
  });

  it('never gives free more than paid on a numeric cap', () => {
    for (const c of CAPABILITIES) {
      if (c.kind !== 'limit') continue;
      if (typeof c.free === 'number' && typeof c.paid === 'number') {
        expect(c.free, `${c.id}: free cap exceeds paid`).toBeLessThanOrEqual(c.paid);
      }
      // paid: null means uncapped, which is always >= any free cap.
    }
  });

  /**
   * Safety content is not a feature. Somebody grabs a hardhead catfish or a
   * stingray whether or not they paid, so the handling guidance has to be in
   * front of them. This is the one gate that could injure a person, and it is
   * asserted rather than left to a code review.
   */
  it('keeps Handle With Care free', () => {
    const care = CAPABILITIES.find((c) => c.id === 'care.full');
    expect(care?.free).toBe(true);
    expect(DEFAULT_MATRIX['care.full'].free).toBe(true);
  });

  it('inverts ads: on for free, off for paid', () => {
    expect(DEFAULT_MATRIX['ads.enabled'].free).toBe(true);
    expect(DEFAULT_MATRIX['ads.enabled'].paid).toBe(false);
  });
});

describe('mergeMatrix', () => {
  it('ignores junk and keeps the shipped defaults', () => {
    for (const junk of [null, undefined, 42, 'nope', [], { 'not.a.cap': { free: true } }]) {
      expect(mergeMatrix(junk)).toEqual(DEFAULT_MATRIX);
    }
  });

  it('applies a valid override', () => {
    const m = mergeMatrix({ 'locations.count': { free: 3, paid: null } });
    expect(m['locations.count']).toEqual({ free: 3, paid: null });
  });

  it('keeps the default when only one side is valid', () => {
    const m = mergeMatrix({ 'locations.count': { free: 'lots', paid: 12 } });
    expect(m['locations.count'].free).toBe(DEFAULT_MATRIX['locations.count'].free);
    expect(m['locations.count'].paid).toBe(12);
  });

  it('cannot be tricked into closing the safety gate', () => {
    // A hostile or corrupt config must not be able to hide handling guidance.
    const m = mergeMatrix({ 'care.full': { free: 'false' } });
    expect(m['care.full'].free).toBe(true);
  });

  it('floors and clamps numbers', () => {
    const m = mergeMatrix({ 'fish.count': { free: -5, paid: 7.9 } });
    expect(m['fish.count'].free).toBe(0);
    expect(m['fish.count'].paid).toBe(7);
  });
});

describe('reads', () => {
  it('treats a zero cap as off and null as uncapped', () => {
    const m = mergeMatrix({ 'fish.count': { free: 0, paid: null } });
    expect(can(m, 'fish.count', 'free')).toBe(false);
    expect(can(m, 'fish.count', 'paid')).toBe(true);
    expect(limitOf(m, 'fish.count', 'paid')).toBeNull();
  });

  it('caps a list only when a cap exists', () => {
    const items = [1, 2, 3, 4, 5];
    const m = mergeMatrix({ 'locations.count': { free: 2, paid: null } });
    expect(capList(items, m, 'locations.count', 'free')).toEqual([1, 2]);
    expect(capList(items, m, 'locations.count', 'paid')).toEqual(items);
  });

  it('returns false for an unknown capability rather than throwing', () => {
    expect(can(DEFAULT_MATRIX, 'nope.nope', 'paid')).toBe(false);
    expect(limitOf(DEFAULT_MATRIX, 'nope.nope', 'paid')).toBeNull();
  });
});
