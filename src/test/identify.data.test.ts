import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { bytesToBase64, fitWithin, MAX_EDGE } from '../lib/image';
import { CONFIDENCE_LABEL, parseFishIdResult, resolveGuideMatch } from '../lib/identify';
import { FISH, HAZARDS } from '../data';

/**
 * Photo ID — the parts with no DOM in them.
 *
 * Three separate jobs here, and the middle one is the load-bearing test of the
 * whole feature: the Edge Function pins Claude to a fixed list of species ids
 * via its output schema, and the client turns those ids into in-app links. If
 * the two lists drift, either the model can name a species with no page behind
 * it or the guide gains a species the model can never suggest. Neither failure
 * is visible at runtime — you just quietly stop getting matches — so it is
 * caught here instead.
 */

/* ------------------------------------------------------------------- image */

describe('downscaling arithmetic', () => {
  it('fits a landscape photo inside the box on its long edge', () => {
    expect(fitWithin(4032, 3024, 1024)).toEqual({ width: 1024, height: 768 });
  });

  it('fits a portrait photo on its long edge too', () => {
    expect(fitWithin(3024, 4032, 1024)).toEqual({ width: 768, height: 1024 });
  });

  it('never scales a small photo up', () => {
    // Upscaling would cost more vision tokens and add no information.
    expect(fitWithin(640, 480, MAX_EDGE)).toEqual({ width: 640, height: 480 });
  });

  it('leaves an exactly-sized photo alone', () => {
    expect(fitWithin(1024, 1024, 1024)).toEqual({ width: 1024, height: 1024 });
  });

  it('never rounds a dimension down to zero', () => {
    const out = fitWithin(4000, 3, 100);
    expect(out.width).toBe(100);
    expect(out.height).toBeGreaterThanOrEqual(1);
  });

  it('survives a degenerate size rather than dividing by zero', () => {
    expect(fitWithin(0, 0, 1024)).toEqual({ width: 0, height: 0 });
  });
});

describe('base64 encoding', () => {
  it('round-trips bytes', () => {
    const bytes = new Uint8Array([0, 1, 2, 250, 251, 255]);
    expect(atob(bytesToBase64(bytes.buffer))).toHaveLength(6);
  });

  it('encodes a payload larger than one chunk without blowing the stack', () => {
    // The naive String.fromCharCode(...bytes) spread dies somewhere around
    // 100k arguments; a real photo is an order of magnitude past that.
    const big = new Uint8Array(300_000).fill(7);
    const encoded = bytesToBase64(big.buffer);
    expect(encoded.length).toBeGreaterThan(390_000);
    expect(encoded).toMatch(/^[A-Za-z0-9+/]+={0,2}$/);
  });
});

/* ------------------------------------------------- guide / function sync */

/** The species list the Edge Function hands to Claude, parsed out of its source. */
function edgeFunctionSpecies(): Array<{ id: string; kind: string; name: string }> {
  // Resolved from the project root, not from import.meta.url: under vite-node
  // the module URL is an http:// dev-server URL, not a file:// path.
  const source = readFileSync(
    resolve(process.cwd(), 'supabase/functions/identify-fish/index.ts'),
    'utf8',
  );
  const block = /const GUIDE_SPECIES[^=]*=\s*\[([\s\S]*?)\n\];/.exec(source);
  if (!block) throw new Error('could not find GUIDE_SPECIES in the identify-fish function');
  return [...block[1].matchAll(/\{\s*id:\s*"([^"]+)",\s*kind:\s*"([^"]+)",\s*name:\s*"([^"]+)"\s*\}/g)]
    .map((m) => ({ id: m[1], kind: m[2], name: m[3] }));
}

describe('the model can only name species this guide documents', () => {
  const listed = edgeFunctionSpecies();

  it('parsed the function’s species list at all', () => {
    // Guards against this suite passing because the regex stopped matching.
    expect(listed.length).toBeGreaterThan(0);
  });

  it('lists every target species and every hazard species, and nothing else', () => {
    expect(listed.map((s) => s.id).sort()).toEqual(
      [...FISH.map((f) => f.id), ...HAZARDS.map((h) => h.id)].sort(),
    );
  });

  it('gives each id the same display name and kind the guide uses', () => {
    for (const entry of listed) {
      const fish = FISH.find((f) => f.id === entry.id);
      const hazard = HAZARDS.find((h) => h.id === entry.id);
      if (fish) {
        expect(entry.kind, `${entry.id} is a target species`).toBe('fish');
        expect(entry.name, `${entry.id} name drifted from src/data/fish.ts`).toBe(fish.name);
      } else if (hazard) {
        expect(entry.kind, `${entry.id} is a hazard species`).toBe('hazard');
        expect(entry.name, `${entry.id} name drifted from src/data/hazards.ts`).toBe(hazard.name);
      } else {
        throw new Error(`${entry.id} is in the function but in neither data module`);
      }
    }
  });

  it('has no id that means two different things', () => {
    const fishIds = new Set(FISH.map((f) => f.id));
    for (const h of HAZARDS) {
      expect(fishIds.has(h.id), `${h.id} is both a target and a hazard`).toBe(false);
    }
  });
});

describe('resolving a match to a real in-app page', () => {
  it('sends every target species to its own page', () => {
    for (const f of FISH) {
      expect(resolveGuideMatch(f.id)).toEqual({
        kind: 'fish',
        id: f.id,
        name: f.name,
        to: `/fish/${f.id}`,
      });
    }
  });

  it('sends every hazard species to Handle With Care', () => {
    for (const h of HAZARDS) {
      const match = resolveGuideMatch(h.id);
      expect(match?.kind, h.id).toBe('hazard');
      expect(match?.name, h.id).toBe(h.name);
      expect(match?.to, h.id).toBe('/care');
    }
  });

  it('links nothing rather than guessing', () => {
    // A wrong deep link is worse than none: it sends a reader to confident
    // handling instructions for an animal they are not holding.
    for (const id of ['none', '', 'sheepshead', 'Snook', 'fish/snook', null, undefined]) {
      expect(resolveGuideMatch(id), String(id)).toBeNull();
    }
  });
});

/* -------------------------------------------------------------- validation */

const GOOD = {
  identified: true,
  common_name: 'Common Snook',
  scientific_name: 'Centropomus undecimalis',
  confidence: 'high',
  field_marks: 'Black lateral line running onto the tail; jutting lower jaw.',
  guide_species_id: 'snook',
  is_potentially_hazardous: true,
  hazard_note: 'Razor-sharp gill covers.',
  also_consider: ['Fat snook'],
};

describe('parsing what comes back off the wire', () => {
  it('accepts a well-formed result unchanged', () => {
    expect(parseFishIdResult(GOOD)).toEqual(GOOD);
  });

  it('rejects anything that is not an object with an identified boolean', () => {
    for (const bad of [null, undefined, 'snook', 42, [], {}, { identified: 'yes' }]) {
      expect(parseFishIdResult(bad), JSON.stringify(bad)).toBeNull();
    }
  });

  it('falls back to the least confident reading of an unknown confidence', () => {
    expect(parseFishIdResult({ ...GOOD, confidence: 'certain' })?.confidence).toBe('low');
    expect(parseFishIdResult({ ...GOOD, confidence: undefined })?.confidence).toBe('low');
  });

  it('treats a claimed identification with no name as no identification', () => {
    expect(parseFishIdResult({ ...GOOD, common_name: '   ' })?.identified).toBe(false);
  });

  it('fails safe on the hazard flag', () => {
    // Only an explicit false clears it, and an unidentified animal is always
    // hazardous — you handle what you cannot name as if it bites.
    expect(parseFishIdResult({ ...GOOD, is_potentially_hazardous: false })?.is_potentially_hazardous)
      .toBe(false);
    expect(
      parseFishIdResult({ ...GOOD, is_potentially_hazardous: undefined })
        ?.is_potentially_hazardous,
    ).toBe(true);
    expect(
      parseFishIdResult({ ...GOOD, identified: false, common_name: '', is_potentially_hazardous: false })
        ?.is_potentially_hazardous,
    ).toBe(true);
  });

  it('drops junk out of the look-alike list instead of rendering it', () => {
    expect(
      parseFishIdResult({ ...GOOD, also_consider: ['Fat snook', '', null, 7, '  '] })?.also_consider,
    ).toEqual(['Fat snook']);
    expect(parseFishIdResult({ ...GOOD, also_consider: 'Fat snook' })?.also_consider).toEqual([]);
  });

  it('coerces missing strings to empty rather than undefined', () => {
    const parsed = parseFishIdResult({ identified: false });
    expect(parsed).not.toBeNull();
    expect(parsed?.common_name).toBe('');
    expect(parsed?.guide_species_id).toBe('none');
    expect(parsed?.field_marks).toBe('');
  });

  it('never expresses confidence as a number', () => {
    // We have no calibrated basis for a percentage, so the UI must not imply one.
    for (const label of Object.values(CONFIDENCE_LABEL)) {
      expect(label).not.toMatch(/\d/);
      expect(label).not.toContain('%');
    }
  });
});
