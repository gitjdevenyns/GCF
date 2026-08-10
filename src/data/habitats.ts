import type { Habitat } from './types';

/**
 * Migrated from v6 window.HABITATS (data.js). Diagram paths are local SVGs
 * under public/assets/habitats/ and are given relative to the site base.
 */
export const HABITATS: Habitat[] = [
  {
    id: 'oyster',
    name: 'Oyster bar / reef',
    diagram: 'assets/habitats/oyster.svg',
    photos: [
      {
        url: 'https://blog.wfsu.org/blog-coastal-health/wp-content/uploads/2010/09/IMG_3499-small-1170x878.jpg',
        alt: 'Exposed oyster bar at low tide',
      },
      {
        url: 'https://www.enr.com/ext/resources/2023/07/13/GettyImages-1374052671_ENRready.webp?t=1689259571',
        alt: 'Oyster reef ridge in shallow water',
      },
    ],
    look: 'Raised rough shell ridge. At low tide it may be exposed; submerged bars often create ripples/current breaks.',
    fish: 'Redfish • sheepshead • black drum • snapper',
    how: 'Cast along the edge, especially the down-current tip. Keep braid away from shell.',
  },
  {
    id: 'grass',
    name: 'Grass flat + potholes',
    diagram: 'assets/habitats/grass.svg',
    photos: [
      {
        url: 'https://midcurrent.com/wp-content/uploads/2023/07/1.FEATURE-Fly-fishing-saltwater-flats-potholes-St.-Croix-web-e1689162317430.jpg',
        alt: 'Sand potholes in a grass flat',
      },
      {
        url: 'https://www.saltstrong.com/wp-content/uploads/spots-pic7.jpg',
        alt: 'Satellite view of grass flat with potholes',
      },
    ],
    look: 'Dark green/brown = grass. Pale circles/irregular patches = sand holes. Satellite view makes contrast obvious.',
    fish: 'Trout • redfish • snook',
    how: 'Cast beyond the hole and retrieve across the light/dark boundary.',
  },
  {
    id: 'mangrove',
    name: 'Mangrove point',
    diagram: 'assets/habitats/mangrove.svg',
    photos: [
      {
        url: 'https://content.osgnetworks.tv/photopacks/fs-inshore-points_522113/522115_fs-inshorepoints-03_hero_1200x800.jpg',
        alt: 'Mangrove point protruding into moving water',
      },
    ],
    look: 'A shoreline corner protruding into moving water. Best points often have exposed roots, bait and nearby depth.',
    fish: 'Snook • redfish • snapper',
    how: 'Incoming: cast near flooded roots. Outgoing: fish the tip and drains.',
  },
  {
    id: 'pass',
    name: 'Pass / inlet',
    diagram: 'assets/habitats/pass.svg',
    photos: [
      {
        url: 'https://smifclub.com/wp-content/uploads/2023/06/image-13.png',
        alt: 'Pass between Gulf and bay with visible current',
      },
      {
        url: 'https://www.halfhitch.com/images/Default/images/Fishing-the-Flats-tip/Fishing-the-Flats-13.jpg',
        alt: 'Sandbar tips and color changes at an inlet',
      },
    ],
    look: 'Narrow Gulf/bay opening with rips, foam lines, sandbar tips, color changes and eddies.',
    fish: 'Tarpon • snook • jacks • mackerel • snapper',
    how: 'Fish seams and edges rather than only the fastest water.',
  },
  {
    id: 'bridge',
    name: 'Bridge piling / shadow',
    diagram: 'assets/habitats/bridge.svg',
    photos: [
      {
        url: 'https://www.sportfishingmag.com/wp-content/uploads/2021/09/bridge-fishing-live-bait-819x1024.jpg',
        alt: 'Fishing live bait at bridge pilings',
      },
    ],
    look: 'Current splits around pilings; night lights create a sharp bright/dark edge.',
    fish: 'Snook • snapper • sheepshead • drum • tarpon',
    how: 'Cast up-current so bait drifts naturally. At night work the shadow line.',
  },
];
