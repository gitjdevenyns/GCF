import { describe, expect, it } from 'vitest';
import {
  FISH,
  HABITATS,
  HAZARDS,
  LOCATIONS,
  SOURCES,
  TIDE_GUIDE,
  VIDEOS,
} from '../data';
import type { MediaRef } from '../data';

/**
 * Content-quality invariants.
 *
 * These are the rules that make the guide safe and honest to ship, as opposed
 * to merely well-formed. They are deliberately strict: a regression here is a
 * product/safety regression, not a cosmetic one.
 */

/** Every MediaRef in the data set, tagged with where it came from. */
function allMedia(): Array<{ where: string; media: MediaRef }> {
  const out: Array<{ where: string; media: MediaRef }> = [];
  for (const f of FISH) f.images.forEach((m, i) => out.push({ where: `fish/${f.id}[${i}]`, media: m }));
  for (const h of HAZARDS) {
    if (h.image) out.push({ where: `hazard/${h.id}`, media: h.image });
    h.injury_media.forEach((m, i) => out.push({ where: `hazard/${h.id}/injury[${i}]`, media: m }));
  }
  for (const h of HABITATS) h.photos.forEach((m, i) => out.push({ where: `habitat/${h.id}[${i}]`, media: m }));
  for (const l of LOCATIONS) l.images.forEach((m, i) => out.push({ where: `location/${l.slug}[${i}]`, media: m }));
  return out;
}

describe('media provenance and accessibility', () => {
  it('gives every image a non-empty, non-placeholder alt text', () => {
    for (const { where, media } of allMedia()) {
      expect(media.alt, `${where} has no alt text`).toBeTruthy();
      expect(media.alt.trim().length, where).toBeGreaterThan(3);
      // "image", "photo", "picture" alone are not descriptions.
      expect(media.alt.trim().toLowerCase(), where).not.toMatch(/^(image|photo|picture|img)$/);
    }
  });

  it('only references images over https', () => {
    for (const { where, media } of allMedia()) {
      expect(media.url, where).toMatch(/^https:\/\//);
    }
  });

  it('attributes every documented injury image to a source', () => {
    for (const h of HAZARDS) {
      for (const m of h.injury_media) {
        expect(m.source_url, `hazard/${h.id} injury media needs a source_url`).toMatch(
          /^https:\/\//,
        );
      }
    }
  });
});

describe('external links', () => {
  const urls: Array<{ where: string; url: string }> = [
    ...VIDEOS.map((v) => ({ where: `video/${v.title}`, url: v.url })),
    ...TIDE_GUIDE.stations.map((s) => ({ where: `station/${s.area}`, url: s.url })),
    ...SOURCES.map((s) => ({ where: `source/${s.id}`, url: s.url })),
    ...LOCATIONS.flatMap((l) => l.sources.map((s) => ({ where: `${l.slug}/${s.id}`, url: s.url }))),
  ].filter((u) => u.url !== '');

  it('uses https everywhere', () => {
    for (const { where, url } of urls) {
      expect(url, where).toMatch(/^https:\/\//);
    }
  });

  it('parses every URL', () => {
    for (const { where, url } of urls) {
      expect(() => new URL(url), where).not.toThrow();
    }
  });

  it('points tide station links at NOAA', () => {
    for (const s of TIDE_GUIDE.stations) {
      expect(new URL(s.url).hostname, s.area).toMatch(/noaa\.gov$/);
    }
    for (const l of LOCATIONS) {
      if (l.tide_station.url) {
        expect(new URL(l.tide_station.url).hostname, l.slug).toMatch(/noaa\.gov$/);
      }
    }
  });
});

describe('safety and regulatory honesty', () => {
  /**
   * CLAUDE.md rule: never present a local tactic as if it were official
   * regulation. Guide prose must not assert size/bag limits or open/closed
   * seasons — those belong to FWC and change without notice.
   */
  const REGULATION_CLAIMS = [
    /\bslot\s+limit\s+is\b/i,
    /\bbag\s+limit\s+is\b/i,
    /\byou\s+may\s+keep\s+\d/i,
    /\bit\s+is\s+illegal\s+to\b/i,
    /\bseason\s+is\s+(open|closed)\b/i,
    /\blegal\s+to\s+keep\b/i,
  ];

  function prose(): Array<{ where: string; text: string }> {
    const out: Array<{ where: string; text: string }> = [];
    for (const f of FISH) {
      out.push({ where: `fish/${f.id}`, text: [f.habitat, f.gear, f.leader, f.hook, f.bait, f.landing_tool, f.handling.angler, ...f.handling.dos, ...f.handling.donts].join(' ') });
    }
    for (const h of HAZARDS) out.push({ where: `hazard/${h.id}`, text: `${h.risk} ${h.handle} ${h.risk_short ?? ''}` });
    for (const h of HABITATS) out.push({ where: `habitat/${h.id}`, text: `${h.look} ${h.fish} ${h.how}` });
    for (const l of LOCATIONS) {
      const tp = l.tide_playbook;
      out.push({
        where: `location/${l.slug}`,
        text: [tp.low, tp.incoming, tp.high, tp.outgoing, tp.best_window, ...l.safety, ...l.access_notes, ...l.targets.map((t) => `${t.rig} ${t.bait} ${t.presentation ?? ''} ${t.release_notes ?? ''}`)].join(' '),
      });
    }
    for (const p of TIDE_GUIDE.principles) out.push({ where: `tide/${p.title}`, text: p.body });
    return out;
  }

  it('never states a fishing regulation as fact', () => {
    for (const { where, text } of prose()) {
      for (const pattern of REGULATION_CLAIMS) {
        expect(text, `${where} asserts a regulation: ${pattern}`).not.toMatch(pattern);
      }
    }
  });

  it('gives every hazard both a risk description and handling guidance', () => {
    for (const h of HAZARDS) {
      expect(h.risk.trim().length, h.id).toBeGreaterThan(20);
      expect(h.handle.trim().length, h.id).toBeGreaterThan(20);
    }
  });

  it('covers every Handle With Care species named in the product spec', () => {
    const ids = HAZARDS.map((h) => h.id);
    for (const required of ['catfish', 'stingray', 'lionfish', 'barracuda', 'shark', 'puffer']) {
      expect(
        ids.some((id) => id.includes(required)),
        `no hazard entry matching "${required}"`,
      ).toBe(true);
    }
  });
});

describe('location completeness', () => {
  it('gives every location the fields the page template requires', () => {
    for (const l of LOCATIONS) {
      expect(l.name.trim(), l.slug).toBeTruthy();
      expect(l.region, l.slug).toBeTruthy();
      expect(l.access.length, `${l.slug} has no access type`).toBeGreaterThan(0);
      expect(l.structures.length, `${l.slug} has no structure`).toBeGreaterThan(0);
      expect(l.targets.length, `${l.slug} has no target species`).toBeGreaterThan(0);
    }
  });

  it('keeps target priorities sane', () => {
    for (const l of LOCATIONS) {
      for (const t of l.targets) {
        expect(t.priority, `${l.slug}/${t.species_label}`).toBeGreaterThanOrEqual(1);
        expect(t.species_label.trim(), l.slug).toBeTruthy();
      }
      // Every location should have at least one primary target.
      expect(
        l.targets.some((t) => t.priority === 1),
        `${l.slug} has no priority-1 target`,
      ).toBe(true);
    }
  });

  it('marks prime tide stages as a subset of the four real stages', () => {
    for (const l of LOCATIONS) {
      for (const s of l.tide_playbook.prime_stages) {
        expect(['low', 'incoming', 'high', 'outgoing'], l.slug).toContain(s);
      }
      expect(new Set(l.tide_playbook.prime_stages).size, `${l.slug} duplicates a prime stage`).toBe(
        l.tide_playbook.prime_stages.length,
      );
    }
  });

  it('covers every region named in the data model', () => {
    const regions = new Set(LOCATIONS.map((l) => l.region));
    for (const r of ['Bradenton', 'Anna Maria', 'Englewood', 'Placida', 'Boca Grande']) {
      expect(regions.has(r as never), `no locations in ${r}`).toBe(true);
    }
  });
});
