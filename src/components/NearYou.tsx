import { Link } from 'react-router-dom';
import type { Location, TideStage } from '../data';
import { useGeolocation } from '../lib/geo';
import type { GeoResult } from '../lib/geo';
import { formatMiles, rankNearby } from '../lib/nearby';
import { Chevron } from './location/art';

/**
 * "Near you" — the guide's spots ranked against where someone is standing.
 *
 * The permission ask is an invitation with a button, never an automatic
 * prompt: an unprompted permission sheet gets dismissed on reflex, and a
 * dismissed prompt is sticky, so asking badly once costs the feature for good.
 *
 * The position is used on the device and nowhere else. Ranking is arithmetic
 * against the 25 bundled locations, so this whole feature works with the
 * network cut and no request in it ever carries a coordinate. The copy says
 * so, because a reader deciding whether to grant location deserves to know
 * that before they decide, not in a policy page afterwards.
 */

export interface NearYouProps {
  locations: Location[];
  geo: GeoResult;
  /** Tide stage at the nearest spot's own station, when a reading exists. */
  stage: TideStage | null;
  /** Station the stage came from, named so the reason can be traced. */
  stationName: string | null;
}

export default function NearYou({ locations, geo, stage, stationName }: NearYouProps) {
  const { status, coords, error, request } = geo;

  const spots = coords
    ? rankNearby(locations, coords, { stage, stationName, limit: 3 })
    : [];

  return (
    <div className="cond">
      <div className="cond-hd">
        <span className="lab">Near you</span>
        {status === 'granted' && coords?.accuracy_m !== null && coords?.accuracy_m !== undefined && (
          <span className="mono" style={{ color: 'var(--m)' }}>
            ±{Math.round(coords.accuracy_m)} m
          </span>
        )}
      </div>

      <div className="cond-body">
        {status === 'idle' && (
          <>
            <p className="mut" style={{ marginTop: 0 }}>
              Use your location and this ranks the guide's 25 spots by how close they
              are and what the water is doing right now.
            </p>
            <p className="mut xs">
              Your position stays on your device. It is never sent anywhere, never
              stored, and the ranking works with no signal.
            </p>
            <button type="button" className="btn btn-lime" onClick={request}>
              Use my location
            </button>
          </>
        )}

        {status === 'asking' && (
          <p className="mut" aria-live="polite" style={{ marginTop: 0 }}>
            Waiting for a position…
          </p>
        )}

        {status === 'denied' && (
          <p className="mut" style={{ marginTop: 0 }}>
            No problem — location stays off. You can{' '}
            <Link to="/locations">browse all {locations.length} spots</Link> by area
            instead, or use the pick above. To turn it on later, allow location for
            this site in your browser settings.
          </p>
        )}

        {status === 'unsupported' && (
          <p className="mut" style={{ marginTop: 0 }}>
            This browser cannot share a location.{' '}
            <Link to="/locations">Browse all {locations.length} spots</Link> by area.
          </p>
        )}

        {status === 'error' && (
          <p className="mut" style={{ marginTop: 0 }}>
            {error ?? 'Could not get a position.'}{' '}
            <button
              type="button"
              className="iconbtn"
              onClick={request}
              style={{ minHeight: 28 }}
            >
              Try again
            </button>
          </p>
        )}

        {status === 'granted' && spots.length === 0 && (
          <p className="mut" style={{ marginTop: 0 }}>
            You are outside the stretch this guide covers — it runs from St. Petersburg
            down to Boca Grande Pass.{' '}
            <Link to="/locations">See the whole map</Link>.
          </p>
        )}

        {status === 'granted' && spots.length > 0 && (
          <>
            <ol className="nearlist">
              {spots.map(({ location, miles, reasons }) => (
                <li key={location.slug}>
                  <Link to={`/locations/${location.slug}`} className="nearrow">
                    <div className="nearmain">
                      <b>{location.name}</b>
                      <ul className="nearwhy">
                        {reasons.slice(1).map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </div>
                    {/* Distance holds its own column rather than riding beside
                        the name: it is the one value that is comparable down
                        the list, and a chip that reflows under a long spot
                        name stops being scannable. */}
                    <span className="neardist">
                      <span className="mono">{formatMiles(miles)}</span>
                      <Chevron />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <p className="mut xs" style={{ marginTop: 10 }}>
              Ranked on distance plus what this guide has researched about each spot —
              the tide it fishes, the hours it fishes, the months it fishes.
              {stationName
                ? ` Tide stage read from ${stationName}.`
                : ' No live tide reading right now, so the ranking is distance and researched notes only.'}{' '}
              It is a match, not a forecast: nothing here predicts a catch.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export { useGeolocation };
