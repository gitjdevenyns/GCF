import type { SourceRef } from './types';

/**
 * Authoritative references used by the guide (from the v6 app + handoff docs).
 * Location- and claim-level source wiring is pending content research;
 * this module is the shared registry those records will point into.
 */
export const SOURCES: SourceRef[] = [
  {
    id: 'noaa-tides-currents',
    label: 'NOAA Tides & Currents',
    url: 'https://tidesandcurrents.noaa.gov/',
    publisher: 'NOAA',
  },
  {
    id: 'noaa-8726247',
    label: 'NOAA Bradenton, Manatee River station 8726247',
    url: 'https://tidesandcurrents.noaa.gov/stationhome.html?id=8726247',
    publisher: 'NOAA',
  },
  {
    id: 'noaa-8726282',
    label: 'NOAA Anna Maria City Pier station 8726282',
    url: 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8726282',
    publisher: 'NOAA',
  },
  {
    id: 'fwc-saltwater',
    label: 'FWC saltwater fishing regulations and fish handling',
    url: 'https://myfwc.com/fishing/saltwater/',
    publisher: 'Florida Fish and Wildlife Conservation Commission',
    note: 'Verify current regulations before keeping any fish.',
  },
  {
    id: 'florida-museum',
    label: 'Florida Museum species profiles',
    url: 'https://www.floridamuseum.ufl.edu/discover-fish/',
    publisher: 'Florida Museum of Natural History',
  },
  {
    id: 'wem-stingray-case',
    label: 'Documented stingray injury case',
    url: 'https://journals.sagepub.com/doi/10.1016/j.wem.2015.03.006',
    publisher: 'Wilderness & Environmental Medicine',
  },
  {
    id: 'divernet-lionfish-case',
    label: 'Documented lionfish sting case',
    url: 'https://divernet.com/scuba-diving/ouch-lionfish-divers-a-world-of-pain/',
    publisher: 'Divernet',
  },
];

export const sourceById = (id: string): SourceRef | undefined =>
  SOURCES.find((s) => s.id === id);
