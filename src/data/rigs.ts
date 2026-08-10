import type { Rig, VideoLink } from './types';

/** Migrated from the v6 Rig + Knot School section (index.html, hardcoded). */
export const RIGS: Rig[] = [
  {
    id: 'free-line',
    name: 'Free-line',
    schematic: 'BRAID ━ LEADER ━ CIRCLE HOOK ━ LIVE BAIT',
    use: 'Snook, redfish, snapper.',
  },
  {
    id: 'popping-cork',
    name: 'Popping cork',
    schematic: 'BRAID ━ CORK ━ 18–36" LEADER ━ HOOK/JIG ━ SHRIMP',
    use: 'Trout and redfish over grass.',
  },
  {
    id: 'fish-finder',
    name: 'Fish-finder',
    schematic: 'BRAID ━ SLIDING SINKER ━ SWIVEL ━ LEADER ━ CIRCLE',
    use: 'Beach and deeper-current bottom fishing.',
  },
  {
    id: 'knocker',
    name: 'Knocker rig',
    schematic: 'BRAID ━ LEADER ━ EGG WEIGHT ━ CIRCLE',
    use: 'Snapper and structure.',
  },
  {
    id: 'weedless-paddletail',
    name: 'Weedless paddletail',
    schematic: 'BRAID ━ LEADER ━ 3/0–4/0 WEIGHTED EWG + PLASTIC',
    use: 'Grass, mangroves, redfish/snook.',
  },
  {
    id: 'jig-head',
    name: 'Jig head',
    schematic: 'BRAID ━ LEADER ━ 1/8–3/8 OZ JIG + PADDLETAIL',
    use: 'Use the lightest weight that reaches the zone.',
  },
];

export const rigById = (id: string): Rig | undefined =>
  RIGS.find((r) => r.id === id);

/** Migrated from v6 window.VIDEOS (data.js). */
export const VIDEOS: VideoLink[] = [
  { title: 'FG Knot — braid to leader', url: 'https://www.youtube.com/watch?v=Xt2wB7H_9Zw' },
  { title: 'Uni Knot — terminal tackle', url: 'https://www.youtube.com/watch?v=myMSMYy_iYU' },
  { title: 'Non-Slip Loop Knot — lures', url: 'https://www.youtube.com/watch?v=Us0wL8KS4ww' },
  { title: 'Fish-Finder Rig — FWC', url: 'https://www.youtube.com/watch?v=96xlLW2tu24' },
  {
    title: 'Popping Cork Rig tutorials',
    url: 'https://www.youtube.com/results?search_query=how+to+rig+popping+cork+saltwater+shrimp',
  },
  {
    title: 'Knocker Rig tutorials',
    url: 'https://www.youtube.com/results?search_query=how+to+tie+knocker+rig+mangrove+snapper',
  },
];
