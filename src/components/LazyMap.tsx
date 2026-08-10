import { Suspense, lazy } from 'react';
import type { ComponentProps } from 'react';
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
 */
const MapViewLazy = lazy(() => import('./MapView'));

type Props = ComponentProps<typeof MapView>;

export default function LazyMap(props: Props) {
  return (
    <Suspense
      fallback={
        <div
          className={`map ${props.className ?? ''}`.trim()}
          role="status"
          aria-label="Loading map"
        >
          <span className="vh">Loading map</span>
        </div>
      }
    >
      <MapViewLazy {...props} />
    </Suspense>
  );
}
