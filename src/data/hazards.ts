import type { Hazard } from './types';

/**
 * Merged from v6 window.CREATURES (supplement.js — richer descriptions +
 * identification images), window.DANGER (data.js — short risk labels) and
 * window.INJURY_MEDIA (data.js — documented injury cases).
 * All six creatures and both injury-media entries are preserved.
 */
export const HAZARDS: Hazard[] = [
  {
    id: 'catfish',
    name: 'Hardhead / Gafftopsail Catfish',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Ariopsis_felis_%28FDA_099%29.jpg',
      alt: 'Hardhead catfish, showing the stout serrated spine at the front of the dorsal fin and the paired spines at the leading edge of each pectoral fin',
      source_url: 'https://commons.wikimedia.org/wiki/File:Ariopsis_felis_(FDA_099).jpg',
      license: 'Public domain (U.S. Food and Drug Administration, via Wikimedia Commons)',
    },
    risk: 'Sharp venom-associated dorsal and pectoral spines can cause a painful puncture.',
    risk_short: 'Venomous dorsal/pectoral spines',
    handle:
      'Do not wrap your hand around the body behind the head. Keep clear of the dorsal and side spines; use long pliers/dehooker and cut the leader if needed.',
    injury_media: [],
  },
  {
    id: 'stingray',
    name: 'Southern / Atlantic Stingray',
    image: {
      url: 'https://lirp.cdn-website.com/b44e0cd2/dms3rep/multi/opt/stingrays-1920w.jpg',
      alt: 'Southern stingray identification photo',
    },
    risk: 'Defensive venomous spine near the base of the whip-like tail.',
    risk_short: 'Venomous tail spine',
    handle:
      'Keep the ray in the water when possible. Never grab the tail. Use a long dehooker; while wading use the stingray shuffle.',
    injury_media: [
      {
        url: 'https://journals.sagepub.com/cms/10.1016/j.wem.2015.03.006/asset/6b61691f-3e98-4b0e-b209-21f72b7c5860/assets/images/large/10.1016_jwem201503006-fig1.jpg',
        alt: 'Documented stingray injury case (Wilderness & Environmental Medicine)',
        source_url: 'https://journals.sagepub.com/doi/10.1016/j.wem.2015.03.006',
      },
    ],
  },
  {
    id: 'lionfish',
    name: 'Lionfish',
    image: {
      url: 'https://www.tallahasseemagazine.com/content/uploads/data-import/sh/shutterstock37472188ccsz.jpg',
      alt: 'Lionfish identification photo',
    },
    risk: 'Venomous dorsal, pelvic and anal fin spines.',
    risk_short: 'Venomous fin spines',
    handle:
      'Never grab around the fins. Use tools and a puncture-resistant container if retaining one.',
    injury_media: [
      {
        url: 'https://divernet.com/wp-content/uploads/2022/12/IMG_6285-924x1024.jpg',
        alt: 'Documented lionfish sting injury (Divernet)',
        source_url:
          'https://divernet.com/scuba-diving/ouch-lionfish-divers-a-world-of-pain/',
      },
    ],
  },
  {
    id: 'barracuda',
    name: 'Great Barracuda',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Banco_de_gran_barracudas_%28Sphyraena_barracuda%29%2C_parque_nacional_Ras_Muhammad%2C_Egipto%2C_2022-03-27%2C_DD_115.jpg/1280px-Banco_de_gran_barracudas_%28Sphyraena_barracuda%29%2C_parque_nacional_Ras_Muhammad%2C_Egipto%2C_2022-03-27%2C_DD_115.jpg',
      alt: 'Great barracuda: long silver torpedo-shaped body, deeply forked tail and an underslung jaw full of long teeth',
      source_url:
        'https://commons.wikimedia.org/wiki/File:Banco_de_gran_barracudas_(Sphyraena_barracuda),_parque_nacional_Ras_Muhammad,_Egipto,_2022-03-27,_DD_115.jpg',
      license: 'CC BY-SA 4.0 — Diego Delso, delso.photo, via Wikimedia Commons',
    },
    risk: 'Large, extremely sharp teeth; an agitated fish can slash during handling.',
    risk_short: 'Severe bite',
    handle:
      'Keep hands completely away from the mouth. Use long pliers; control/release large fish alongside the boat.',
    injury_media: [],
  },
  {
    id: 'sharks',
    name: 'Sharks',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Requin_bouledogue_%28Carcharhinus_leucas%29_%28Ifremer_00813-92510_-_53592%29.jpg/1280px-Requin_bouledogue_%28Carcharhinus_leucas%29_%28Ifremer_00813-92510_-_53592%29.jpg',
      alt: 'Bull shark: heavy blunt rounded snout, small eyes and a large triangular first dorsal fin — the shark most often encountered in Gulf Coast inshore water',
      source_url:
        'https://commons.wikimedia.org/wiki/File:Requin_bouledogue_(Carcharhinus_leucas)_(Ifremer_00813-92510_-_53592).jpg',
      license: 'CC BY 4.0 — Jerome Paillet / IFREMER, via Wikimedia Commons',
    },
    risk: 'Bite hazard plus species-identification and legal requirements.',
    risk_short: 'Bite + legal ID risk',
    handle:
      'Do not put hands near the mouth or gills. Keep prohibited/unknown sharks in the water and cut the leader close when that is the safest quick release.',
    injury_media: [],
  },
  {
    id: 'pufferfish',
    name: 'Southern Puffer / Pufferfish',
    image: {
      url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/45647957/large.jpg',
      alt: 'Southern puffer identification photo',
    },
    risk: 'Primary danger is toxin if eaten; puffer toxins can cause severe neurologic poisoning and cooking/cleaning does not reliably destroy the toxin.',
    handle:
      'Treat unfamiliar puffers as release-only. Use pliers/dehooker, avoid putting fingers near the beak-like mouth, and do not prepare one for food.',
    injury_media: [],
  },
];
