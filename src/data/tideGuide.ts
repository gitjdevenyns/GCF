import type { TideGuide } from './types';

/** Migrated from v6 window.TIDE_GUIDE (supplement.js). */
export const TIDE_GUIDE: TideGuide = {
  principles: [
    {
      title: 'Moving water matters',
      body: 'Predators often position where current delivers bait. Current seams, points, drains, bridge pilings and oyster tips become feeding stations.',
    },
    {
      title: 'Incoming tide',
      body: 'Water floods grass, oyster edges and mangrove roots. Fish can push shallower. On flats, start at outside edges and move inward with the water.',
    },
    {
      title: 'High tide',
      body: 'Maximum access to flooded mangroves/shorelines. Fish can spread out, so focus on points, pockets, shade and bait activity.',
    },
    {
      title: 'Outgoing tide',
      body: 'Water drains flats and mangroves. Fish often collect at creek mouths, cuts, points and potholes as prey is pulled toward deeper water.',
    },
    {
      title: 'Low tide',
      body: 'Structure becomes visible. Use low water to learn oyster bars, potholes and channels. Fish often concentrate in remaining depth.',
    },
    {
      title: 'Wind',
      body: 'Wind can move surface water, muddy a shoreline or create a productive wind-blown bank. Strong wind against tide can make passes rough.',
    },
    {
      title: 'Water clarity',
      body: 'Clear water: longer/lighter leader and natural colors. Dirty water: vibration, contrast, scent and tighter casts to structure can help.',
    },
    {
      title: 'Temperature',
      body: 'Warm water often favors dawn/dusk; cold snaps can push fish into deeper, more stable water. Snook are especially cold-sensitive.',
    },
    {
      title: 'Moon / tide range',
      body: 'Larger ranges usually mean more current; tiny ranges can mean slower water. Local wind can make actual water level differ from prediction.',
    },
    {
      title: 'Safety',
      body: 'Passes, bridge channels and inlet mouths can become hazardous when current opposes wind. Never let a fishing plan override safe conditions.',
    },
  ],
  /**
   * The nine NOAA CO-OPS stations that back the fifteen locations, each verified
   * against the CO-OPS metadata API. The v6 data listed four entries, two of
   * which were "station search" placeholders; those are gone — every area now
   * resolves to a real station id (KNOWN_ISSUES.md #4).
   *
   * `locations.ts` is the source of truth for which spot uses which station; the
   * Tides page groups the spots underneath these entries by id.
   */
  stations: [
    {
      area: 'Bradenton / Manatee River',
      name: 'NOAA Bradenton, Manatee River 8726247',
      url: 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8726247',
    },
    {
      area: 'Manatee River mouth',
      name: 'NOAA Desoto Point 8726273',
      url: 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8726273',
    },
    {
      area: 'Palma Sola Bay (north)',
      name: 'NOAA Palma Sola Bay North 8726249',
      url: 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8726249',
    },
    {
      area: 'Palma Sola Bay (south)',
      name: 'NOAA Palma Sola Bay South 8726233',
      url: 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8726233',
    },
    {
      area: 'Cortez / north Sarasota Bay',
      name: 'NOAA Cortez 8726217',
      url: 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8726217',
    },
    {
      area: 'Anna Maria / northern island',
      name: 'NOAA Anna Maria, City Pier 8726282',
      url: 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8726282',
    },
    {
      area: 'Englewood / Lemon Bay',
      name: 'NOAA Englewood, Lemon Bay 8725747',
      url: 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8725747',
    },
    {
      area: 'Placida / Gasparilla Sound',
      name: 'NOAA Placida, Gasparilla Sound 8725667',
      url: 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8725667',
    },
    {
      area: 'Boca Grande / Charlotte Harbor',
      name: 'NOAA Port Boca Grande 8725577',
      url: 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8725577',
    },
  ],
};
