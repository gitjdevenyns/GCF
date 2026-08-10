import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import type { Location } from '../data';

// Bundle Leaflet's default marker images locally (no CDN).
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props {
  locations: Location[];
  /** Fixed center/zoom (mini map); otherwise fits bounds of the locations. */
  center?: [number, number];
  zoom?: number;
  mini?: boolean;
  /** Start on the Esri imagery layer — the satellite context a spot needs. */
  satellite?: boolean;
  /**
   * `false` turns the map into a still image: no dragging, zooming, layer
   * switch or popups. Used where the map is a backdrop rather than a tool (the
   * location hero band), so it cannot swallow a scroll gesture on a phone.
   *
   * A still map also drops Leaflet's attribution control, because a scrim and
   * the page's own type sit on top of it. Anything passing `interactive={false}`
   * must therefore credit the tile source in its own visible caption.
   */
  interactive?: boolean;
  className?: string;
  /** Client-side navigation for a pin. Falls back to a plain link. */
  onSelect?: (slug: string) => void;
  /** Accessible name for the map region. */
  label?: string;
}

/**
 * Leaflet map with OpenStreetMap street tiles and an Esri World Imagery
 * satellite layer, bundled locally via npm. Every pin opens a popup that links
 * to that location's page.
 */
export default function MapView({
  locations,
  center,
  zoom,
  mini,
  satellite,
  interactive = true,
  className,
  onSelect,
  label,
}: Props) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  // Keep the latest callback without re-running the marker effect.
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    if (!el.current || mapRef.current) return;
    try {
      const map = L.map(el.current, {
        center: center ?? [27.18, -82.49],
        zoom: zoom ?? 9,
        scrollWheelZoom: !mini && interactive,
        ...(interactive
          ? {}
          : {
              dragging: false,
              touchZoom: false,
              doubleClickZoom: false,
              boxZoom: false,
              keyboard: false,
              zoomControl: false,
              attributionControl: false,
            }),
      });
      const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      });
      const sat = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Esri World Imagery', maxZoom: 19 },
      );
      (satellite ? sat : street).addTo(map);
      if (interactive) L.control.layers({ Street: street, Satellite: sat }).addTo(map);
      markersRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
    } catch {
      // Map init can fail in non-browser environments (tests); the rest of
      // the page must still render.
    }
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const group = markersRef.current;
    if (!map || !group) return;
    group.clearLayers();

    for (const loc of locations) {
      const marker = L.marker([loc.lat, loc.lng], {
        icon: DefaultIcon,
        title: loc.name,
        alt: `${loc.name}, ${loc.region}`,
        keyboard: interactive,
        interactive,
      });

      // A still map's pin is decoration: there is nothing to open, and a popup
      // the reader cannot dismiss by dragging would be a trap.
      if (!interactive) {
        marker.addTo(group);
        continue;
      }

      const popup = document.createElement('div');
      const title = document.createElement('b');
      title.textContent = loc.name;
      const meta = document.createElement('div');
      meta.className = 'mut xs';
      meta.textContent = `${loc.region} · ${loc.structures.join(' · ')}`;
      const open = document.createElement('a');
      open.href = `${import.meta.env.BASE_URL}locations/${loc.slug}`;
      open.textContent = 'Open location page';
      open.addEventListener('click', (e) => {
        const go = selectRef.current;
        if (!go) return;
        e.preventDefault();
        go(loc.slug);
      });
      popup.append(title, meta, open);
      marker.bindPopup(popup);
      marker.addTo(group);
    }

    if (!center && locations.length > 0) {
      map.fitBounds(
        L.latLngBounds(locations.map((l) => [l.lat, l.lng] as [number, number])),
        { padding: [30, 30], maxZoom: 12 },
      );
    }
    // Sizing inside newly-laid-out containers.
    const t = setTimeout(() => map.invalidateSize(), 50);
    return () => clearTimeout(t);
  }, [locations, center, mini, interactive]);

  return (
    <div
      ref={el}
      className={`map${className ? ` ${className}` : ''}`}
      role="region"
      aria-label={label ?? 'Map of fishing locations'}
    />
  );
}
