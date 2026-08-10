import { Suspense, lazy } from 'react';
import type { ComponentProps } from 'react';
import ErrorBoundary from './ErrorBoundary';
import type MapView from './MapView';

/**
 * Code-split wrapper for the map.
 *
 * Leaflet plus its CSS and marker images is the single largest dependency in
 * the app, and only two of the eleven routes render a map. Loading it eagerly
 * put it in the initial bundle for every visitor, including someone who only
 * ever opens a species page — a real cost on the phone-on-a-boat-ramp
 * connection this guide is built for.
 *
 * The fallback reserves the map's exact box so nothing below it shifts when the
 * chunk arrives.
 *
 * The chunk can also fail to arrive at all: offline mid-session, or a deploy
 * that replaced the hashed file this build asks for (see lib/appUpdate.ts).
 * That used to throw straight through to the route's error boundary and take
 * the whole page down — a location page losing its map is no reason to lose
 * the tide plan, the rig and the handling notes with it. So the map owns its
 * own boundary and degrades to a labelled box.
 */
const MapViewLazy = lazy(() => import('./MapView'));

type Props = ComponentProps<typeof MapView> & {
  /**
   * Decorative placements (the location hero backdrop) render nothing at all
   * on failure, the way `HeroImage` does: the band's gradient is a designed
   * surface in its own right, and an error notice behind a title would be
   * noise about something the reader never asked for.
   */
  quiet?: boolean;
};

export default function LazyMap({ quiet, ...props }: Props) {
  const box = `map ${props.className ?? ''}`.trim();

  return (
    <ErrorBoundary
      fallback={() =>
        quiet ? null : (
          <div className={box} role="status">
            <p className="map-fallback">
              The map could not load.{' '}
              <button type="button" className="linkish" onClick={() => window.location.reload()}>
                Reload the page
              </button>
              {' '}to try again — everything else here works without it.
            </p>
          </div>
        )
      }
    >
      <Suspense
        fallback={<div className={box} role="status" aria-label="Loading map" />}
      >
        <MapViewLazy {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
