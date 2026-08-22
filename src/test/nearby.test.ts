import { describe, expect, it } from 'vitest';
import { LOCATIONS } from '../data';
import { milesBetween } from '../lib/geo';
import { daypartAt, rankNearby, seasonCoversMonth } from '../lib/nearby';

/** Bradenton-ish, in the middle of the guide's footprint. */
const HERE = { lat: 27.4989, lng: -82.5748 };
/** Miami — far outside it. */
const FAR = { lat: 25.7617, lng: -80.1918 };

describe('milesBetween', () => {
  it('is zero for the same point and symmetric', () => {
    expect(milesBetween(HERE, HERE)).toBeCloseTo(0, 6);
    expect(milesBetween(HERE, FAR)).toBeCloseTo(milesBetween(FAR, HERE), 6);
  });

  it('matches a known distance', () => {
    // Bradenton -> Miami is roughly 175 miles great-circle.
    expect(milesBetween(HERE, FAR)).toBeGreaterThan(160);
    expect(milesBetween(HERE, FAR)).toBeLessThan(195);
  });
});

describe('seasonCoversMonth', () => {
  it('reads a leading range', () => {
    expect(seasonCoversMonth('Apr–Oct snook along the mangrove edges', 5)).toBe(true);
    expect(seasonCoversMonth('Apr–Oct snook along the mangrove edges', 0)).toBe(false);
  });

  it('wraps across the new year', () => {
    expect(seasonCoversMonth('Dec–Mar sheepshead on the pier and bars', 0)).toBe(true);
    expect(seasonCoversMonth('Dec–Mar sheepshead on the pier and bars', 11)).toBe(true);
    expect(seasonCoversMonth('Dec–Mar sheepshead on the pier and bars', 6)).toBe(false);
  });

  it('makes no claim for a note without a range', () => {
    // "most of the year" is not a month claim, and must not be read as one.
    for (let m = 0; m < 12; m += 1) {
      expect(seasonCoversMonth('Trout on the grass most of the year', m)).toBe(false);
    }
  });
});

describe('daypartAt', () => {
  it('covers all 24 hours', () => {
    for (let h = 0; h < 24; h += 1) {
      expect(['dawn', 'day', 'dusk', 'night']).toContain(daypartAt(h));
    }
  });
});

describe('rankNearby', () => {
  it('returns nothing when the guide does not cover where you are', () => {
    expect(rankNearby(LOCATIONS, FAR, { stage: null })).toEqual([]);
  });

  it('ranks real spots near the footprint, nearest-first on a tie', () => {
    const out = rankNearby(LOCATIONS, HERE, { stage: null, limit: 3 });
    expect(out.length).toBeGreaterThan(0);
    expect(out.length).toBeLessThanOrEqual(3);
    for (const s of out) expect(s.miles).toBeLessThanOrEqual(30);
    // Sorted by score, and never by nothing.
    for (let i = 1; i < out.length; i += 1) {
      expect(out[i - 1].score).toBeGreaterThanOrEqual(out[i].score);
    }
  });

  it('never claims a tide match when there is no tide reading', () => {
    const out = rankNearby(LOCATIONS, HERE, { stage: null, limit: 25 });
    for (const s of out) {
      expect(s.tideMatched).toBe(false);
      for (const r of s.reasons) expect(r).not.toMatch(/stage/i);
    }
  });

  it('attributes the tide reason to the station it came from', () => {
    const out = rankNearby(LOCATIONS, HERE, {
      stage: 'incoming',
      stationName: 'Cortez',
      limit: 25,
    });
    const matched = out.filter((s) => s.tideMatched);
    expect(matched.length).toBeGreaterThan(0);
    for (const s of matched) {
      expect(s.reasons.some((r) => r.includes('Cortez'))).toBe(true);
    }
  });

  it('always gives every suggestion at least one reason', () => {
    const out = rankNearby(LOCATIONS, HERE, { stage: 'outgoing', limit: 25 });
    for (const s of out) {
      expect(s.reasons.length).toBeGreaterThan(0);
      for (const r of s.reasons) expect(r.trim()).not.toBe('');
    }
  });

  it('only cites a season the spot actually documents', () => {
    const out = rankNearby(LOCATIONS, HERE, { stage: null, limit: 25 });
    for (const s of out) {
      const cited = s.reasons.find((r) => r.startsWith('In season now'));
      if (!cited) continue;
      // The quoted note must be one of that spot's own researched strings.
      expect(s.location.seasons.some((n) => cited.includes(n))).toBe(true);
    }
  });

  it('honours maxMiles', () => {
    const out = rankNearby(LOCATIONS, HERE, { stage: null, maxMiles: 3, limit: 25 });
    for (const s of out) expect(s.miles).toBeLessThanOrEqual(3);
  });
});
