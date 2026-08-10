import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  FISH,
  HABITATS,
  HAZARDS,
  LOCATIONS,
  RIGS,
  TIDE_GUIDE,
  VIDEOS,
  fishById,
  rigById,
} from '../data';

describe('data integrity', () => {
  it('preserves all migrated v6 content counts', () => {
    // 15 migrated v6 spots + 10 researched Tampa Bay / Sarasota spots.
    expect(LOCATIONS).toHaveLength(25);
    expect(FISH).toHaveLength(5);
    expect(HAZARDS).toHaveLength(6);
    expect(HABITATS).toHaveLength(5);
    expect(RIGS).toHaveLength(6);
    expect(VIDEOS).toHaveLength(6);
    expect(TIDE_GUIDE.principles).toHaveLength(10);
  });

  it('gives every location a unique, well-formed kebab-case slug', () => {
    const slugs = LOCATIONS.map((l) => l.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('places every location in Southwest Florida coordinate bounds', () => {
    for (const l of LOCATIONS) {
      expect(l.lat).toBeGreaterThan(26);
      expect(l.lat).toBeLessThan(28);
      expect(l.lng).toBeGreaterThan(-83.5);
      expect(l.lng).toBeLessThan(-81.5);
    }
  });

  it('only references fish and rigs that exist', () => {
    for (const l of LOCATIONS) {
      expect(l.targets.length).toBeGreaterThan(0);
      for (const t of l.targets) {
        if (t.species_id) {
          expect(fishById(t.species_id), `${l.slug}: ${t.species_id}`).toBeDefined();
        }
        if (t.rig_id) {
          expect(rigById(t.rig_id), `${l.slug}: ${t.rig_id}`).toBeDefined();
        }
      }
    }
  });

  it('has a full four-stage tide playbook everywhere', () => {
    for (const l of LOCATIONS) {
      for (const stage of ['low', 'incoming', 'high', 'outgoing'] as const) {
        expect(l.tide_playbook[stage].length).toBeGreaterThan(0);
      }
      expect(l.tide_playbook.best_window.length).toBeGreaterThan(0);
    }
  });

  it('gives every location a verified NOAA tide station', () => {
    // Each id below was confirmed against the CO-OPS metadata API and returns
    // live predictions; this asserts we never regress a location back to null
    // or drift away from the station set mirrored in Supabase.
    const KNOWN_STATIONS = new Set([
      '8726247', // Bradenton, Manatee River
      '8726273', // Desoto Point
      '8726249', // Palma Sola Bay North
      '8726233', // Palma Sola Bay South
      '8726217', // Cortez
      '8726282', // Anna Maria, City Pier
      '8725747', // Englewood, Lemon Bay
      '8725667', // Placida, Gasparilla Sound
      '8725577', // Port Boca Grande, Charlotte Harbor
      '8726034', // Siesta Key, Big Sarasota Pass
      '8726089', // Longboat Key, Sarasota Bay
      '8726347', // Egmont Key, Tampa Bay
      '8726364', // Mullet Key, Tampa Bay (Skyway)
      '8726428', // Tierra Verde
      '8726520', // St. Petersburg, Tampa Bay
    ]);

    for (const l of LOCATIONS) {
      expect(l.tide_station.noaa_id, `${l.slug} has no tide station`).not.toBeNull();
      expect(KNOWN_STATIONS, l.slug).toContain(l.tide_station.noaa_id);
      expect(l.tide_station.url, l.slug).toContain(l.tide_station.noaa_id as string);
    }
  });

  it('keeps handling guidance for every fish', () => {
    for (const f of FISH) {
      expect(f.handling.dos.length).toBeGreaterThan(0);
      expect(f.handling.donts.length).toBeGreaterThan(0);
      expect(f.handling.angler.length).toBeGreaterThan(0);
    }
  });

  it('ships every referenced habitat diagram locally', () => {
    for (const h of HABITATS) {
      const file = resolve(import.meta.dirname, '../../public', h.diagram);
      expect(existsSync(file), h.diagram).toBe(true);
    }
  });
});
