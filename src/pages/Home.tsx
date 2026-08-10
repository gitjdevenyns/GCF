import { Link } from 'react-router-dom';
import { getFishList, getHabitats, getHazards, getLocations } from '../lib/api';
import { REGIONS } from '../data';
import type { Location, TideStage } from '../data';
import { useConditions } from '../lib/useConditions';
import { compactSky, timeAgo } from '../lib/conditions';
import type { ConditionsResult } from '../lib/conditions';
import { Callout, ErrorState, FreshnessNote, Plate, SectionTitle, Skeleton } from '../components/ui';
import { Chevron, HabitatGlyph, HeroWave, TideCurve } from '../components/location/art';
import { zonesFor } from '../components/location/zones';

/**
 * Home (design board 01). The first fold answers one question — go where, on
 * what tide, and why — and everything below it is browsing.
 *
 * Live conditions are strictly additive (see lib/conditions.ts): the page is
 * complete and useful with zero network, so every live slot either shows real
 * data, a skeleton, an inline retry, or nothing at all. It never shows a
 * plausible-looking placeholder.
 */

/** The reference station for the home card. Stated on the card, not implied. */
const REFERENCE_SLUG = 'emerson-point';

const STAGE_CHIP: Record<TideStage, string> = {
  low: 'Low water',
  incoming: 'Tide is filling',
  high: 'High water',
  outgoing: 'Tide is falling',
};

function stationClock(iso: string): string | null {
  const m = /T(\d{2}):(\d{2})/.exec(iso);
  if (!m) return null;
  const h = Number(m[1]);
  return `${h % 12 === 0 ? 12 : h % 12}:${m[2]} ${h < 12 ? 'am' : 'pm'}`;
}

/**
 * The spot to send someone to right now.
 *
 * With a live tide stage we can say something defensible: this location's
 * playbook lists that stage as one of its prime windows. Without one we fall
 * back to a stable starting point and say so — no "best on this tide" claim
 * that nothing backs up.
 */
function pickRecommendation(stage: TideStage | null, locations: Location[]): Location {
  const fallback = locations[0];
  if (!stage) return fallback;
  const prime = locations.filter((l) => l.tide_playbook.prime_stages.includes(stage));
  if (prime.length === 0) return fallback;
  const walkable = prime.find((l) => l.access.includes('shore') || l.access.includes('wade'));
  return walkable ?? prime[0];
}

/* ------------------------------------------------------------ conditions */

function ConditionsCard({
  reference,
  conditions,
}: {
  reference: Location;
  conditions: ConditionsResult;
}) {
  const { status, data, freshness, error, refetch } = conditions;
  const phase = data?.phase ?? null;
  const weather = data?.weather ?? null;

  const cells: Array<[string, string, string?]> = [];
  if (weather?.air_temp_f !== null && weather?.air_temp_f !== undefined)
    cells.push(['Air', `${Math.round(weather.air_temp_f)}°`]);
  if (weather?.wind_mph !== null && weather?.wind_mph !== undefined)
    cells.push(['Wind', `${weather.wind_dir ?? ''} ${Math.round(weather.wind_mph)}`.trim()]);
  // Abbreviated for the cell; the full NWS wording stays in the title.
  const sky = compactSky(weather?.summary);
  if (sky) cells.push(['Sky', sky, weather?.summary ?? undefined]);
  if (phase?.next)
    cells.push([
      phase.next.type === 'H' ? 'Next high' : 'Next low',
      stationClock(phase.next.time) ?? '—',
    ]);

  return (
    <div className="cond">
      <div className="cond-hd">
        <span className="lab">Conditions now</span>
        <span className="mono" style={{ color: 'var(--m)' }}>
          {data?.station_name ?? reference.tide_station.name}
        </span>
      </div>
      <div className="cond-body">
        {status === 'loading' && (
          <div aria-busy="true">
            <div className="cond-now">
              <Skeleton width={8} />
            </div>
            <div className="cond-grid" data-cells="4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton width={4} />
                </div>
              ))}
            </div>
            <p className="mut xs" style={{ marginTop: 10 }}>
              Reading the latest tide and forecast…
            </p>
          </div>
        )}

        {status === 'error' && (
          <ErrorState onRetry={refetch}>
            <span>
              Live conditions did not load{error ? `: ${error}` : ''}. Everything else on this
              page works offline.
            </span>
          </ErrorState>
        )}

        {status === 'unavailable' && (
          <p className="mut">
            Live tide and weather are not switched on in this build. The guide still works
            offline — read the stage you are on from{' '}
            <a href={reference.tide_station.url} target="_blank" rel="noreferrer">
              {reference.tide_station.name} ↗
            </a>{' '}
            and match it to <Link to="/tides">the four stages</Link>.
          </p>
        )}

        {status === 'ready' && (
          <>
            <div className="cond-now">
              {phase && <span className="chip chip-lime">{STAGE_CHIP[phase.stage]}</span>}
              {phase?.height_ft !== null && phase?.height_ft !== undefined && (
                <span className="big">
                  {phase.height_ft > 0 ? '+' : ''}
                  {phase.height_ft.toFixed(1)} ft
                </span>
              )}
              {phase?.next && (
                <span className="mut">
                  {phase.next.type === 'H' ? 'high' : 'low'} at{' '}
                  {stationClock(phase.next.time) ?? 'an unknown time'}
                </span>
              )}
            </div>

            {data && <TideCurve tides={data.tides} phase={phase} />}

            {cells.length > 0 && (
              <div className="cond-grid" data-cells={cells.length}>
                {cells.map(([label, value, full]) => (
                  <div key={label}>
                    <span className="lab" style={{ fontSize: 9.5 }}>
                      {label}
                    </span>
                    <b title={full}>{value}</b>
                    {full && full !== value && <span className="vh">{full}</span>}
                  </div>
                ))}
              </div>
            )}

            {!phase && !weather && (
              <p className="mut">
                The snapshot for this station came back empty. Read the stage from{' '}
                <a href={reference.tide_station.url} target="_blank" rel="noreferrer">
                  NOAA ↗
                </a>
                .
              </p>
            )}
          </>
        )}

        {(status === 'ready' || (status === 'error' && data)) && (
          <div style={{ marginTop: 10 }}>
            <FreshnessNote state={freshness}>
              {reference.region} reference station · updated {timeAgo(data?.refreshed_at)}
            </FreshnessNote>
            <p className="mut xs" style={{ marginTop: 4 }}>
              Tide times shift along the coast — each spot page reads its own station.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ page */

export default function Home() {
  const locations = getLocations();
  const fish = getFishList();
  const habitats = getHabitats();
  const hazards = getHazards();

  const reference = locations.find((l) => l.slug === REFERENCE_SLUG) ?? locations[0];
  const conditions = useConditions(reference.slug);
  const stage = conditions.status === 'ready' ? (conditions.data?.phase?.stage ?? null) : null;

  const pick = pickRecommendation(stage, locations);
  const pickZones = zonesFor(pick);
  const isPrime = stage ? pick.tide_playbook.prime_stages.includes(stage) : false;

  return (
    <>
      <section className="hero">
        <div className="hero-sun" aria-hidden="true" />
        <HeroWave />
        <div className="stack g3">
          {stage && (
            <span className="chip chip-lime" style={{ alignSelf: 'flex-start', position: 'relative' }}>
              {STAGE_CHIP[stage]} · {reference.region} station
            </span>
          )}
          <h1 className="rise">
            Read the water
            <br />
            <em>before</em> you cast.
          </h1>
          <p>
            Fifteen shore, kayak and boat spots from the Manatee River to Boca Grande Pass — with
            the structure, the tide and the rig spelled out.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-lime" to="/locations">
              Find a spot
            </Link>
            <Link className="btn btn-ghost" to="/water">
              Learn the water
            </Link>
          </div>
        </div>
      </section>

      <section className="sect" aria-labelledby="conditions">
        <h2 className="vh" id="conditions">
          Conditions at the {reference.region} reference station
        </h2>
        <ConditionsCard reference={reference} conditions={conditions} />
      </section>

      <section className="sect" aria-labelledby="gohere">
        <SectionTitle id="gohere">Go here now</SectionTitle>
        <div className="rec">
          <Plate
            media={pick.images[0] ?? null}
            caption={`satellite · ${pick.name.toLowerCase()}`}
            className="rec-plate"
          />
          <div className="rec-top">
            <div className="row g2 wrap" style={{ marginBottom: 5 }}>
              <span className="chip chip-lime">
                {isPrime ? 'Prime on this tide' : 'Good place to start'}
              </span>
              <span className="chip">{pick.access.join(' · ')}</span>
            </div>
            <h3>{pick.name}</h3>
            <p className="mut">
              {pick.region} · {pick.structures.join(' · ')}
            </p>
          </div>
          <div className="rec-why">
            <div className="bar" />
            <div className="mut" style={{ color: 'var(--t)' }}>
              {stage ? (
                <>
                  {pick.tide_playbook[stage]}{' '}
                  {pickZones.length > 0 && (
                    <>
                      Structure to look for: {pickZones.map((z) => z.title.toLowerCase()).join(', ')}.{' '}
                    </>
                  )}
                </>
              ) : (
                <>
                  Best window here is <b>{pick.tide_playbook.best_window.toLowerCase()}</b>.{' '}
                </>
              )}
              Targets: {pick.targets.map((t) => t.species_label.toLowerCase()).join(', ')}.
            </div>
          </div>
          <div className="pad" style={{ paddingBottom: 'var(--s4)' }}>
            <Link className="btn btn-blue btn-block" to={`/locations/${pick.slug}`}>
              Open the location page
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="species">
        <div className="sect" style={{ paddingBottom: 0 }}>
          <SectionTitle id="species" to="/fish" linkLabel={`All ${fish.length}`}>
            Target species
          </SectionTitle>
        </div>
        <div className="hscroll">
          {fish.map((f) => (
            <Link className="fishcard" to={`/fish/${f.id}`} key={f.id}>
              <Plate media={f.images[0] ?? null} caption={`id · ${f.name.toLowerCase()}`} />
              <div className="fc-b">
                <h3>{f.name}</h3>
                <p className="mut xs">{f.habitat}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="sect" aria-labelledby="water">
        <SectionTitle id="water" to="/water" linkLabel="Read water">
          Learn the water
        </SectionTitle>
        <div className="stack g2">
          {habitats.map((h) => (
            <Link className="habcard" to="/water" key={h.id}>
              <div className="dia">
                <HabitatGlyph id={h.id} />
              </div>
              <div>
                <h3>{h.name}</h3>
                <div className="mut xs">{h.look}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="sect" aria-labelledby="areas">
        <SectionTitle id="areas" to="/locations" linkLabel={`All ${locations.length}`}>
          Spots by area
        </SectionTitle>
        <div className="card">
          {REGIONS.map((region) => {
            const inRegion = locations.filter((l) => l.region === region);
            if (inRegion.length === 0) return null;
            return (
              <Link
                className="zonerow"
                key={region}
                to={`/locations?region=${encodeURIComponent(region)}`}
              >
                <div className="row g3">
                  <span className="n">{inRegion.length}</span>
                  <div>
                    <b>{region}</b>
                    <div className="mut xs">
                      {inRegion.length === 1
                        ? inRegion[0].name
                        : inRegion
                            .slice(0, 3)
                            .map((l) => l.name.split(' / ')[0])
                            .join(' · ')}
                      {inRegion.length > 3 ? ' …' : ''}
                    </div>
                  </div>
                </div>
                <Chevron />
              </Link>
            );
          })}
        </div>
        <Link className="btn btn-ghost btn-block" to="/locations" style={{ marginTop: 'var(--s3)' }}>
          Open the map
        </Link>
      </section>

      <section className="sect" aria-labelledby="care" style={{ paddingBottom: 'var(--s7)' }}>
        <h2 className="vh" id="care">
          Handle with care
        </h2>
        <Link className="care-teaser" to="/care">
          <div>
            <div className="lab" style={{ color: 'var(--warn-text)' }}>
              Handle with care
            </div>
            <div className="care-title">
              {hazards.length} species worth knowing before you touch one
            </div>
            <div className="mut xs">
              {hazards.map((h) => h.name.split(' ').pop()?.toLowerCase()).join(' · ')}
            </div>
          </div>
          <Chevron />
        </Link>
        <Callout tone="info" className="mt3">
          Tactics on this site are local heuristics, not regulation. Check size limits, closed
          seasons and licence rules with the{' '}
          <a href="https://myfwc.com/fishing/saltwater/" target="_blank" rel="noreferrer">
            FWC
          </a>{' '}
          before you keep anything.
        </Callout>
      </section>
    </>
  );
}
