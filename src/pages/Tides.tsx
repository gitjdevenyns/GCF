import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLocations, getTideGuide } from '../lib/api';
import { Callout, SectionTitle } from '../components/ui';
import { IconClarity, IconMoon, IconTemp, IconWind } from '../components/ui/icons';
import LiveTide from '../components/conditions/LiveTide';

/**
 * Tides & Water — design board 04.
 *
 * The reference every location page points back to: one full cycle explained as
 * four stages, plus the four things that bend it. The argument the screen is
 * built around is that the fastest water is MID-tide, not at the turns, so the
 * curve highlights the two limbs and stages 2 and 4 carry the prime treatment.
 *
 * Two diagram registers, deliberately (per the design notes):
 *   - the tide curve is DATA, so every fill/stroke resolves to a token and it
 *     re-colours correctly in light and dark;
 *   - the cross-sections are HABITAT, so they keep the literal palette shared
 *     with the location structure maps (mangrove g900, grass g700, shell n50,
 *     water b600) in both themes.
 */

/* ------------------------------------------------------------------ shapes */

/** The shoreline profile every cross-section shares, so only the water moves. */
const BED = 'M0 110 L0 30 L52 32 C 76 48, 104 66, 148 70 L 196 71 C 206 62, 220 58, 234 61 C 248 64, 256 84, 272 94 L 326 100 L326 110 Z';
const MANGROVE = 'M0 110 L0 30 L52 32 C 60 40, 66 46, 72 52 L 72 110 Z';
const OYSTER = 'M196 71 C 206 62, 220 58, 234 61 C 240 63, 245 68, 249 73 L 196 74 Z';

interface StageArt {
  /** Water surface y — lower number is higher water. */
  y: number;
  /** Lime surface line (moving) vs blue (slack). */
  moving: boolean;
  /** Flow arrow direction, or none at slack. */
  flow?: 'shoreward' | 'seaward';
  slackLabel?: boolean;
}

function CrossSection({ art, label }: { art: StageArt; label: string }) {
  const surface = art.moving ? '#8dff00' : '#5b98f0';
  return (
    <svg className="sb-x" viewBox="0 0 326 110" role="img" aria-label={label}>
      <rect width="326" height="110" fill="#031530" />
      <path d={BED} fill="#3d6f00" />
      <path d={MANGROVE} fill="#16290a" />
      <path d={OYSTER} fill="#9eb0c3" />
      <rect y={art.y} width="326" height={110 - art.y} fill="#0746a3" opacity=".5" />
      <path d={`M0 ${art.y} H326`} stroke={surface} strokeWidth="2.5" />
      {art.flow === 'shoreward' && (
        <path
          d={`M300 ${art.y - 12} H256 M264 ${art.y - 18} L256 ${art.y - 12} L264 ${art.y - 6}`}
          stroke="#8dff00"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {art.flow === 'seaward' && (
        <path
          d={`M256 ${art.y - 12} H300 M292 ${art.y - 18} L300 ${art.y - 12} L292 ${art.y - 6}`}
          stroke="#8dff00"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {art.slackLabel && (
        <text
          x="300"
          y={art.y - 10}
          textAnchor="end"
          fontFamily="var(--ff-mono)"
          fontSize="9"
          fontWeight="700"
          letterSpacing=".12em"
          fill="#9eb0c3"
        >
          SLACK
        </text>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ stages */

const STAGES = [
  {
    n: 1,
    key: 'low',
    kicker: 'Slack · turning',
    title: 'Low',
    prime: false,
    art: { y: 88, moving: false, slackLabel: true } as StageArt,
    alt: 'Cross-section at low water: the grass flat and oyster bar are exposed, water sits only in the channel',
    body: 'Water has drained off the flat. The bar is out, the potholes are rimmed with dry sand, and the fish are squeezed into whatever depth is left — the cut off the point, the channel edge, the deepest hole.',
    doThis:
      'Fish the remaining depth, then spend the slack hour learning the place. Photograph the shell edge, mark the drain. The map you build at low water is what you fish for the next year.',
  },
  {
    n: 2,
    key: 'incoming',
    kicker: 'Moving',
    title: 'Incoming',
    prime: true,
    art: { y: 68, moving: true, flow: 'shoreward' } as StageArt,
    alt: 'Cross-section on the incoming tide: water climbs shoreward over the flat, flowing toward the mangroves',
    body: 'New water pushes up over the shell and into the grass and the mangrove roots. Bait moves first, predators follow, and fish end up shallower than you would believe — backs out, in inches.',
    doThis:
      'Start at the outside edges while they are still edges, then walk shoreward with the water. Never start where you finished last time.',
  },
  {
    n: 3,
    key: 'high',
    kicker: 'Slack · turning',
    title: 'High',
    prime: false,
    art: { y: 46, moving: false, slackLabel: true } as StageArt,
    alt: 'Cross-section at high water: the whole flat and the mangrove edge are flooded',
    body: 'Maximum access to flooded shoreline — and maximum room for fish to spread out. More water is not more fish. It is the same fish, harder to find.',
    doThis:
      'Stop covering water and start reading it. Points, pockets, shade lines and visible bait beat depth now.',
  },
  {
    n: 4,
    key: 'outgoing',
    kicker: 'Moving',
    title: 'Outgoing',
    prime: true,
    art: { y: 64, moving: true, flow: 'seaward' } as StageArt,
    alt: 'Cross-section on the outgoing tide: the flat drains, flowing toward the channel',
    body: 'The flat empties. Everything living on it gets pulled toward deeper water through a handful of exits — creek mouths, cuts, drains, and the down-current tip of every bar.',
    doThis:
      'Sit down-current of an exit and let the tide deliver bait past you. This is the laziest productive fishing there is.',
  },
] as const;

/** The four principles that "bend" the tide, matched to the real guide data. */
const MODIFIERS: Array<{ title: string; Icon: typeof IconWind }> = [
  { title: 'Wind', Icon: IconWind },
  { title: 'Water clarity', Icon: IconClarity },
  { title: 'Temperature', Icon: IconTemp },
  { title: 'Moon / tide range', Icon: IconMoon },
];

/* -------------------------------------------------------------------- page */

export default function Tides() {
  const guide = getTideGuide();
  const locations = getLocations();
  const [slug, setSlug] = useState(locations[0]?.slug ?? '');
  const selected = locations.find((l) => l.slug === slug) ?? locations[0];

  const principles = useMemo(
    () => new Map(guide.principles.map((p) => [p.title, p.body])),
    [guide.principles],
  );

  /** Spots grouped under the station that actually predicts their water. */
  const byStation = useMemo(() => {
    const map = new Map<string, typeof locations>();
    for (const l of locations) {
      const id = l.tide_station.noaa_id;
      if (!id) continue;
      map.set(id, [...(map.get(id) ?? []), l]);
    }
    return map;
  }, [locations]);

  return (
    <>
      <div className="lochero" style={{ minHeight: 190 }}>
        <span className="cap">reference · no licensed photo in this slot yet</span>
        <div className="inner">
          <span className="chip chip-lime" style={{ marginBottom: 8 }}>
            Moving water wins
          </span>
          <h1 className="d2">
            Four stages,
            <br />
            one cycle
          </h1>
        </div>
      </div>

      <section className="sect">
        <p className="lede">
          Tide is not a number on a chart. It is the thing that decides where every
          fish on a flat is standing, twice a day, on a schedule you can look up.
        </p>
      </section>

      {/* ------------------------------------------------ live, per location */}
      <section className="sect">
        <SectionTitle>Right now</SectionTitle>
        <label className="lab" htmlFor="tide-spot" style={{ display: 'block', marginBottom: 6 }}>
          Show the tide for
        </label>
        <select
          id="tide-spot"
          className="iconbtn"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          style={{ width: '100%', minHeight: 'var(--tap)', marginBottom: 'var(--s3)' }}
        >
          {locations.map((l) => (
            <option key={l.slug} value={l.slug}>
              {l.name} — {l.region}
            </option>
          ))}
        </select>

        {selected && <LiveTide key={selected.slug} location={selected} />}

        {selected && (
          <p className="mut" style={{ marginTop: 'var(--s3)' }}>
            <Link to={`/locations/${selected.slug}`}>
              Open the full plan for {selected.name} →
            </Link>
          </p>
        )}
      </section>

      {/* ----------------------------------------------------------- the cycle */}
      <section className="sect">
        <SectionTitle>The cycle</SectionTitle>
        <div className="wave">
          <svg
            viewBox="0 0 358 200"
            role="img"
            aria-label="Tide curve over one full cycle from low water through incoming, high water and outgoing back to low, with the fastest-current windows highlighted mid-way through each limb"
          >
            <rect x="68" y="26" width="62" height="126" style={{ fill: 'var(--lime)', opacity: 0.14 }} />
            <rect x="227" y="26" width="62" height="126" style={{ fill: 'var(--lime)', opacity: 0.14 }} />
            <path
              d="M20 128 C 99 128, 99 44, 179 44 C 258 44, 258 128, 338 128 L338 152 L20 152 Z"
              style={{ fill: 'var(--accent)', opacity: 0.28 }}
            />
            <path
              d="M20 128 C 99 128, 99 44, 179 44 C 258 44, 258 128, 338 128"
              fill="none"
              strokeWidth="2.6"
              strokeLinecap="round"
              style={{ stroke: 'var(--link)' }}
            />
            <circle cx="20" cy="128" r="4.5" style={{ fill: 'var(--link)' }} />
            <circle cx="179" cy="44" r="4.5" style={{ fill: 'var(--link)' }} />
            <circle cx="338" cy="128" r="4.5" style={{ fill: 'var(--link)' }} />
            <path
              d="M92 112 L99 104 L106 112"
              fill="none"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ stroke: 'var(--lime-text)' }}
            />
            <path
              d="M251 104 L258 112 L265 104"
              fill="none"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ stroke: 'var(--lime-text)' }}
            />
            <path d="M12 152 H346" strokeWidth="1.5" style={{ stroke: 'var(--l2)' }} />
            <g
              fontFamily="var(--ff-mono)"
              fontSize="9"
              fontWeight="800"
              letterSpacing=".1em"
              textAnchor="middle"
              style={{ fill: 'var(--lime-text)' }}
            >
              <text x="99" y="20">INCOMING</text>
              <text x="258" y="20">OUTGOING</text>
            </g>
            <g
              fontFamily="var(--ff-mono)"
              fontSize="10"
              fontWeight="800"
              letterSpacing=".08em"
              style={{ fill: 'var(--m)' }}
            >
              <text x="12" y="170" textAnchor="start">LOW</text>
              <text x="179" y="170" textAnchor="middle">HIGH</text>
              <text x="346" y="170" textAnchor="end">LOW</text>
            </g>
          </svg>
          <div className="wave-key">
            <span>
              <i style={{ background: 'var(--link)' }} />
              <span>Water level across one full cycle — low to low, roughly 12 h 25 min.</span>
            </span>
            <span>
              <i style={{ background: 'var(--lime)', opacity: 0.55 }} />
              <span>
                <b style={{ color: 'var(--t)' }}>
                  The shaded windows are where the water moves fastest
                </b>{' '}
                — mid-tide, not at the turns. That is when feeding stations switch on.
              </span>
            </span>
          </div>
        </div>

        <Callout title="The whole idea in one line" className="callout-spaced">
          {principles.get('Moving water matters') ??
            'Predators do not hunt the tide, they hunt what the tide delivers.'}
        </Callout>
      </section>

      {/* --------------------------------------------------------- the stages */}
      <section className="sect">
        <SectionTitle>Stage by stage</SectionTitle>
        <div className="legend" style={{ margin: '0 0 var(--s3)' }}>
          <div>
            <i style={{ background: '#16290a' }} />
            Mangrove shore
          </div>
          <div>
            <i style={{ background: '#3d6f00' }} />
            Grass flat
          </div>
          <div>
            <i style={{ background: '#9eb0c3' }} />
            Oyster bar
          </div>
          <div>
            <i style={{ background: '#0746a3' }} />
            Water
          </div>
        </div>

        {STAGES.map((s) => (
          <article key={s.key} className={`stageblock${s.prime ? ' is-prime' : ''}`}>
            <div className="sb-hd">
              <span className="n">{s.n}</span>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--ff-mono)',
                    fontSize: "var(--fs-micro)",
                    color: 'var(--m)',
                    letterSpacing: '.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {s.kicker}
                  {s.prime && <span style={{ color: 'var(--lime-text)' }}> · prime</span>}
                </div>
                <h3>{s.title}</h3>
              </div>
            </div>
            <div className="sb-b">
              <CrossSection art={s.art} label={s.alt} />
              <div className="mut" style={{ color: 'var(--t)' }}>
                {s.body}
              </div>
              <p className="mut xs" style={{ marginTop: 'var(--s2)' }}>
                {principles.get(
                  s.key === 'low'
                    ? 'Low tide'
                    : s.key === 'incoming'
                      ? 'Incoming tide'
                      : s.key === 'high'
                        ? 'High tide'
                        : 'Outgoing tide',
                )}
              </p>
              <div className="sb-do">
                <i />
                <span>
                  <b>Do this:</b> {s.doThis}
                </span>
              </div>
            </div>
          </article>
        ))}

        <Callout tone="info" title="Both moving stages are prime — in general" className="callout-spaced">
          Any individual spot has its own best stage, because it depends on which way
          that particular flat drains. The location pages call it; this page explains
          why.
        </Callout>
      </section>

      {/* ------------------------------------------------------- what bends it */}
      <section className="sect">
        <SectionTitle>What bends the tide</SectionTitle>
        <div className="mods">
          {MODIFIERS.map(({ title, Icon }) => (
            <div className="mod" key={title}>
              <span className="ic2">
                <Icon />
              </span>
              <div>
                <b>{title}</b>
                <div className="t">{principles.get(title)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- before you go */}
      <section className="sect">
        <SectionTitle>Before you go</SectionTitle>
        <Callout tone="warn" title="Current is the hazard, not the fish">
          {principles.get('Safety')}
        </Callout>
      </section>

      {/* ------------------------------------------------------------ stations */}
      <section className="sect">
        <SectionTitle>Your tide stations</SectionTitle>
        <div className="card">
          {guide.stations.map((station) => {
            const id = /(\d{7})/.exec(station.name)?.[1] ?? '';
            const spots = byStation.get(id) ?? [];
            return (
              <a
                className="linkrow"
                key={station.name}
                href={station.url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="row g3">
                  <span className="pl" aria-hidden="true">
                    ≈
                  </span>
                  <span>
                    <b>{station.area}</b>
                    <span className="mut xs" style={{ display: 'block' }}>
                      NOAA {id}
                      {spots.length > 0 && ` · ${spots.map((s) => s.name).join(' · ')}`}
                    </span>
                  </span>
                </span>
                <span className="mut" aria-hidden="true">
                  ↗
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------- sources */}
      <section className="sect" style={{ paddingBottom: 'var(--s7)' }}>
        <SectionTitle>Sources</SectionTitle>
        <p className="srcs">
          Predictions and station data:{' '}
          <a href="https://tidesandcurrents.noaa.gov/" target="_blank" rel="noreferrer">
            NOAA Tides &amp; Currents
          </a>
          . Forecasts:{' '}
          <a
            href="https://www.weather.gov/documentation/services-web-api"
            target="_blank"
            rel="noreferrer"
          >
            National Weather Service API
          </a>
          . Both are US Government works in the public domain. Predicted heights are
          astronomical — wind and pressure routinely move the real water level, so
          trust what you can see over what you read.
        </p>
      </section>
    </>
  );
}
