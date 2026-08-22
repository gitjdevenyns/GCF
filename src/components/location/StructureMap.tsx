/**
 * Annotated structure diagram (design board 02, "the diagram is the page").
 *
 * One inline SVG per location, drawn from the location's real `structures`
 * array. Only features the data actually lists are drawn, and every fill is
 * also text-labelled, so colour is never the sole channel.
 *
 * This is a SCHEMATIC, not a survey: the arrangement of features on the canvas
 * is generic. The page says so directly under the drawing and sends the reader
 * to the satellite map for the real layout. Nothing here asserts that a given
 * bar or drain sits at a given place on this particular shoreline — only that
 * the location has one, which is exactly what the data says.
 */
import type { Location } from '../../data';
import type { Zone, ZoneKind } from './zones';

const MAP_LABEL: Record<ZoneKind, string> = {
  mangrove: 'MANGROVE',
  point: 'POINT',
  grass: 'GRASS',
  potholes: 'POTHOLES',
  flat: 'FLAT',
  oyster: 'OYSTER BAR',
  drain: 'DRAIN',
  pass: 'PASS',
  cut: 'BAR CUT',
  channel: 'CHANNEL',
  bridge: 'PILINGS',
  lights: 'LIGHT LINE',
  dock: 'DOCKS',
  seawall: 'SEAWALL',
  surf: 'SURF TROUGH',
  seam: 'CURRENT SEAM',
};

/* Palette — blue, lime and neutral ramps only (see tokens.css). */
const C = {
  shallow: '#0746a3',
  mid: '#052a63',
  deep: '#031530',
  grass: '#3d6f00',
  mangrove: '#16290a',
  scrub: '#2a4d00',
  sand: '#c4d2e0',
  shell: '#9eb0c3',
  built: '#33465c',
  piling: '#55677d',
  lime: '#8dff00',
  drain: '#2d78e8',
};

const SHORE_PATH =
  'M0 0 H390 V44 C 316 66, 254 40, 186 66 C 122 90, 66 74, 0 92 Z';
const BAR_PATH = 'M0 272 C 110 258, 250 266, 390 256';

interface LegendItem {
  swatch: string;
  dashed?: boolean;
  label: string;
}

export default function StructureMap({ loc, zones }: { loc: Location; zones: Zone[] }) {
  const kinds = new Set(zones.map((z) => z.kind));
  const has = (k: ZoneKind) => kinds.has(k);

  const hasDeep = has('pass') || has('channel');
  const beach = has('surf') || has('cut');
  const built = has('seawall') || has('dock');
  const hasShore =
    beach ||
    built ||
    has('mangrove') ||
    has('point') ||
    has('drain') ||
    loc.access.some((a) => a === 'shore' || a === 'wade' || a === 'pier' || a === 'bridge');

  const landFill = has('mangrove')
    ? C.mangrove
    : beach
      ? C.sand
      : built
        ? C.built
        : C.scrub;

  const legend: LegendItem[] = [];
  if (hasShore)
    legend.push({
      swatch: landFill,
      label: has('mangrove')
        ? 'Mangrove shoreline'
        : beach
          ? 'Beach / sand'
          : built
            ? 'Built shoreline'
            : 'Shoreline',
    });
  if (has('grass') || has('flat')) legend.push({ swatch: C.grass, label: 'Grass / flat' });
  if (has('potholes') || beach) legend.push({ swatch: C.sand, label: 'Sand' });
  if (has('oyster')) legend.push({ swatch: C.shell, label: 'Oyster shell' });
  if (has('bridge') || has('dock')) legend.push({ swatch: C.piling, label: 'Pilings' });
  legend.push({ swatch: C.shallow, label: 'Shallow water' });
  if (hasDeep) legend.push({ swatch: C.deep, label: 'Pass / channel' });
  legend.push({ swatch: C.lime, dashed: true, label: 'Current seam — the edge you fish' });

  const described = zones.map((z) => `${z.n}. ${z.title}`).join(', ');

  return (
    <>
      <div className="diagram">
        <svg
          viewBox="0 0 390 300"
          width="100%"
          role="img"
          aria-label={`Schematic plan of ${loc.name} showing ${loc.structures.join(', ')} and ${zones.length} numbered casting zones: ${described}.`}
        >
          {/* water */}
          <rect width="390" height="300" fill={C.shallow} />
          <path
            d="M390 110 L390 300 L110 300 C 236 270, 330 214, 390 110 Z"
            fill={C.mid}
            opacity=".5"
          />

          {/* shoreline */}
          {hasShore && (
            <>
              <path d={SHORE_PATH} fill={landFill} />
              <path
                d="M390 44 C 316 66, 254 40, 186 66 C 122 90, 66 74, 0 92"
                fill="none"
                stroke="rgba(255,255,255,.16)"
                strokeWidth="1.5"
              />
            </>
          )}

          {/* the pass cuts through the shore; the channel is its deep heart */}
          {has('pass') && (
            <path d="M390 0 L390 300 L236 300 C 292 210, 322 108, 312 0 Z" fill={C.mid} />
          )}
          {has('channel') && (
            <path d="M390 58 L390 300 L286 300 C 330 224, 356 132, 348 58 Z" fill={C.deep} />
          )}

          {has('mangrove') &&
            [30, 74, 118, 162].map((x) => (
              <path
                key={x}
                d={`M${x} 86 q 11 12 22 0`}
                fill="none"
                stroke={C.scrub}
                strokeWidth="7"
                strokeLinecap="round"
              />
            ))}

          {has('point') && (
            <path
              d="M104 46 C 128 74, 148 96, 160 124 C 138 130, 114 116, 96 90 Z"
              fill={landFill}
            />
          )}

          {(has('grass') || has('flat')) && (
            <path
              d="M0 148 C 62 136, 132 146, 188 170 C 202 198, 176 228, 138 238 C 82 234, 40 226, 0 216 Z"
              fill={C.grass}
              opacity={has('grass') ? 1 : 0.55}
            />
          )}

          {has('potholes') && (
            <>
              <ellipse cx="168" cy="158" rx="15" ry="7" fill={C.sand} opacity=".9" />
              <ellipse cx="216" cy="182" rx="17" ry="8" fill={C.sand} opacity=".9" />
              <ellipse cx="146" cy="198" rx="11" ry="6" fill={C.sand} opacity=".9" />
            </>
          )}

          {has('oyster') && (
            <>
              <path
                d="M104 240 C 152 262, 214 266, 258 250"
                fill="none"
                stroke={C.shell}
                strokeWidth="15"
                strokeLinecap="round"
              />
              <path
                d="M104 240 C 152 262, 214 266, 258 250"
                fill="none"
                stroke="#e9f0f7"
                strokeWidth="15"
                strokeLinecap="round"
                strokeDasharray="2 5"
                opacity=".55"
              />
            </>
          )}

          {has('drain') && (
            <path
              d="M46 74 C 36 100, 42 124, 56 154"
              fill="none"
              stroke={C.drain}
              strokeWidth="11"
              strokeLinecap="round"
            />
          )}

          {(beach || has('cut')) && (
            <path d={BAR_PATH} fill="none" stroke={C.sand} strokeWidth="16" opacity=".85" />
          )}
          {has('cut') && <path d="M284 240 L324 240 L332 300 L276 300 Z" fill={C.mid} />}

          {/* A span crosses the water, so the deck runs across the channel it
              bridges rather than alongside it. */}
          {has('bridge') && (
            <>
              <rect x="0" y="130" width="390" height="42" fill={C.built} />
              <rect x="0" y="172" width="390" height="9" fill={C.deep} opacity=".55" />
              {[44, 122, 200, 278, 352].map((x) => (
                <rect key={x} x={x} y="130" width="13" height="42" fill={C.piling} />
              ))}
            </>
          )}

          {has('lights') && (
            <>
              <rect x="0" y="181" width="390" height="66" fill={C.lime} opacity=".10" />
              {[44, 122, 200, 278, 352].map((x) => (
                <circle key={x} cx={x + 6} cy="126" r="4" fill={C.lime} />
              ))}
            </>
          )}

          {has('dock') &&
            [
              [300, 58, 52],
              [330, 64, 44],
              [358, 56, 60],
            ].map(([x, y, h]) => (
              <rect key={x} x={x} y={y} width="9" height={h} fill={C.piling} />
            ))}

          {has('seawall') && (
            <path
              d="M390 44 C 316 66, 254 40, 186 66 C 122 90, 66 74, 0 92"
              fill="none"
              stroke={C.shell}
              strokeWidth="5"
            />
          )}

          {/* current seam — always present; it is what every zone is an edge of */}
          <path
            d={
              hasDeep
                ? 'M336 6 C 306 92, 282 200, 296 296'
                : 'M16 262 C 90 244, 220 240, 374 214'
            }
            fill="none"
            stroke={C.lime}
            strokeWidth="2"
            strokeDasharray="7 6"
          />

          {/* numbered zones */}
          {zones.map((z) => {
            const { x, y } = z.anchor;
            const above = y > 236;
            const ly = above ? y - 24 : y + 32;
            const anchor = x < 64 ? 'start' : x > 326 ? 'end' : 'middle';
            const lx = x < 64 ? 12 : x > 326 ? 378 : x;
            return (
              <g key={z.n}>
                <circle
                  cx={x}
                  cy={y}
                  r="14"
                  fill="rgba(141,255,0,.20)"
                  stroke={C.lime}
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="800"
                  fill={C.lime}
                  fontFamily="var(--ff-mono)"
                >
                  {z.n}
                </text>
                <text
                  x={lx}
                  y={ly}
                  textAnchor={anchor}
                  fontSize="10"
                  fontWeight="700"
                  letterSpacing=".06em"
                  fill="#edffd6"
                  fontFamily="var(--ff-mono)"
                  paintOrder="stroke"
                  stroke={C.deep}
                  strokeWidth="3.6"
                  strokeLinejoin="round"
                >
                  {MAP_LABEL[z.kind]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="legend">
        {legend.map((item) => (
          <div key={item.label}>
            <i
              style={
                item.dashed
                  ? { background: 'transparent', border: `2px dashed ${item.swatch}` }
                  : { background: item.swatch }
              }
            />
            {item.label}
          </div>
        ))}
      </div>
    </>
  );
}
