import { describe, expect, it } from 'vitest';
import { SHOPS } from '../data/shops';
import { LOCATIONS } from '../data/locations';
import {
  AD_SLOTS, FREE_PLACEMENTS, MAX_PHOTOS, parseAdCampaigns, parseShopListings,
} from '../lib/listings';

const slugs = new Set(LOCATIONS.map((l) => l.slug));

describe('shop directory', () => {
  it('has unique slugs and real regions', () => {
    const s = SHOPS.map((x) => x.slug);
    expect(new Set(s).size).toBe(s.length);
  });

  it('only claims to serve real locations', () => {
    const bad = SHOPS.flatMap((s) => s.serves.filter((x) => !slugs.has(x)).map((x) => `${s.slug} -> ${x}`));
    expect(bad).toEqual([]);
  });

  /**
   * These are real businesses. Every entry has to be traceable, or a reader
   * drives to an address nobody checked.
   */
  it('gives every shop an address and a checkable source', () => {
    const bad = SHOPS.filter((s) => !s.address?.trim()).map((s) => s.slug);
    expect(bad, 'shop with no address').toEqual([]);
    const unsourced = SHOPS.filter((s) => s.sources.length === 0 && s.verification === 'verified');
    expect(unsourced.map((s) => s.slug), 'verified but unsourced').toEqual([]);
  });

  it('has plausible Florida coordinates', () => {
    const bad = SHOPS.filter((s) => !(s.lat > 25 && s.lat < 29 && s.lng > -84 && s.lng < -81));
    expect(bad.map((s) => `${s.slug} ${s.lat},${s.lng}`)).toEqual([]);
  });
});

describe('listings model', () => {
  it('treats junk as free, never as paid', () => {
    for (const junk of [null, 42, 'x', [{}], [{ shop_slug: 'a' }]]) {
      for (const l of parseShopListings(junk)) {
        expect(l.tier).toBe('basic');
        expect(l.placements).toEqual(FREE_PLACEMENTS);
      }
    }
  });

  it('downgrades an expired enhanced deal to basic content, keeping the shop listed', () => {
    const [l] = parseShopListings([{
      shop_slug: 'bridge-street-bait-shop', included: true, tier: 'enhanced',
      ends_at: '2020-01-01T00:00:00Z',
      enhanced: { offer_text: 'expired offer' },
      placements: { map_pin: true },
    }]);
    expect(l.included).toBe(true);
    expect(l.enhanced.offer_text).toBeNull();
    expect(l.placements.map_pin).toBe(false);
  });

  it('caps photos', () => {
    const [l] = parseShopListings([{
      shop_slug: 'x', tier: 'enhanced',
      enhanced: { photos: Array.from({ length: 20 }, (_, i) => `https://x/${i}.jpg`) },
    }]);
    expect(l.enhanced.photos.length).toBeLessThanOrEqual(MAX_PHOTOS);
  });

  /**
   * An ad that cannot name its advertiser cannot be disclosed honestly, so it
   * must not render at all.
   */
  it('refuses an ad with no advertiser or headline', () => {
    const out = parseAdCampaigns([
      { id: '1', headline: 'no advertiser', active: true },
      { id: '2', advertiser: 'Someone', active: true },
      { id: '3', advertiser: 'Real Co', headline: 'Real ad', active: true, starts_at: '2020-01-01T00:00:00Z' },
    ]);
    expect(out.map((a) => a.id)).toEqual(['3']);
  });

  it('drops inactive and expired campaigns', () => {
    const out = parseAdCampaigns([
      { id: 'a', advertiser: 'A', headline: 'h', active: false },
      { id: 'b', advertiser: 'B', headline: 'h', active: true, ends_at: '2020-01-01T00:00:00Z' },
    ]);
    expect(out).toEqual([]);
  });

  it('declares ad slots with stable ids', () => {
    const ids = AD_SLOTS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThan(0);
  });
});
