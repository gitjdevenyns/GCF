/**
 * Inline SVG art for the Home and Location screens (design boards 01 and 02).
 *
 * Two registers, deliberately — the same split the Tides screen documents:
 *
 *   DATA art (the tide curve) resolves every fill and stroke to a semantic
 *   token, so it re-colours with the theme.
 *
 *   PLACE art (the hero chart, the habitat glyphs, the tide-stage glyphs) is a
 *   picture of water over ground. Water is blue and shell is pale grey at 2am
 *   as much as at noon, so these keep one literal palette in both themes,
 *   drawn only from the brand ramps in tokens.css: blue --b*, lime --g*,
 *   neutral --n*.
 *
 * Every shape is either decorative (`aria-hidden`) or paired with visible text,
 * so colour is never the sole carrier of meaning.
 */
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { stationClock } from '../../lib/conditions';
import type { TideEvent, TidePhase } from '../../lib/conditions';
import type { TideStage } from '../../data';

/* --------------------------------------------------------------- palette */

/**
 * The literal palette shared by every "place" drawing on the site, so a bar
 * drawn in the hero, in a habitat glyph and in a location structure map is
 * recognisably the same bar. Each value is a documented step of one of the two
 * brand ramps (see tokens.css) — there are no hues here that are not already
 * in the design system.
 */
const C = {
  deep: '#031530', // --b900  open water, the bottom of the chart
  mid: '#052a63', // --b800  the shelf
  shallow: '#0746a3', // --b700  water you can wade
  wash: '#2d78e8', // --b500  contour line, submerged
  surface: '#5b98f0', // --b400  the water surface line
  pale: '#8fbaf7', // --b300  spray, highlight
  mangrove: '#16290a', // --g900  canopy
  scrub: '#2a4d00', // --g800  prop roots, wrack
  grass: '#3d6f00', // --g700  turtle grass
  weed: '#5ca300', // --g600  new blades
  lime: '#8dff00', // --g400  the edge you fish
  sand: '#c4d2e0', // --n40   sand, bare bottom
  shell: '#9eb0c3', // --n50   oyster shell
  piling: '#55677d', // --n70  timber, concrete
  built: '#33465c', // --n80  deck, seawall
} as const;

/* ------------------------------------------------------- generated field */

/**
 * A deterministic depth field, used by the hero chart and the shoreline that
 * closes it. Value noise on an integer lattice, three octaves, plus two
 * shaping terms: a shore-to-sea ramp and one meandering channel. The result is
 * a bathymetry — high values are shallow ground, low values are deep water —
 * so contour lines drawn through it behave like the ones on a real chart:
 * close together where the bottom drops away, wide apart across a flat.
 *
 * It is generated rather than hand-drawn for the usual reason: nobody can
 * author two hundred nested, non-crossing contour lines by hand, and a wave
 * traced by hand would be a decoration instead of a depth.
 *
 * It is a schematic, not a survey. Nothing here claims to be a real bottom,
 * and the hero says so in its own caption.
 */
function hash(ix: number, iy: number) {
  let h = (ix * 374761393 + iy * 668265263) | 0;
  h = Math.imul(h ^ (h >> 13), 1274126177);
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

const smoothstep = (t: number) => t * t * (3 - 2 * t);

function value2d(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = smoothstep(x - ix);
  const fy = smoothstep(y - iy);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
}

function fbm(x: number, y: number) {
  return (
    0.55 * value2d(x, y) +
    0.3 * value2d(x * 2.13 + 11.3, y * 2.13 + 7.7) +
    0.15 * value2d(x * 4.31 + 3.1, y * 4.31 + 19.4)
  );
}

/**
 * Bed elevation at (u, v), both 0..1. v = 0 is offshore, v = 1 is the beach.
 *
 * The shore-to-sea ramp is deliberately not linear. The waterline is the one
 * contour anyone is meant to notice, and on a phone the type block owns the
 * top two thirds of the band, so the ground the tide walks over has to live in
 * the bottom third. Raising v to a power puts the shallow half of the depth
 * range down there and leaves the deep half — and its channel — spread across
 * the space behind the headline, where a sparse texture is what is wanted.
 */
function bedAt(u: number, v: number) {
  const ramp = 0.82 * Math.pow(v, 2.2) + 0.18 * u;
  const channel = 0.36 + 0.13 * Math.sin(u * 3.3 + 1.1) + 0.045 * Math.sin(u * 7.4 + 2.6);
  const dv = v - channel;
  const cut = Math.exp(-(dv * dv) / (2 * 0.1 * 0.1)) * 0.26;
  return 0.62 * ramp + 0.55 * fbm(u * 4.8, v * 2.6) - cut;
}

/* --------------------------------------------------------- hero chart */

/** Drawing box for the hero chart. Stretched to the band; strokes do not scale. */
const CHART_W = 320;
const CHART_H = 200;
/** Sampled past both edges so the field never shows a seam. */
const CHART_PAD = 18;
const NX = 64;
const NY = 34;
/** How many fixed contours the chart carries. */
const CONTOURS = 11;

type Pt = [number, number];

/**
 * The sampled field, normalised to 0..1, plus the sample coordinates.
 *
 * Built on first use rather than at import. This module is also what the
 * location screens pull their tide timeline out of, and none of them draw the
 * chart; making every one of them pay for a few thousand noise samples on
 * import is exactly the kind of cost that only shows up on an old phone.
 */
const buildField = () => {
  const x0 = -CHART_PAD;
  const x1 = CHART_W + CHART_PAD;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= NX; i += 1) xs.push(x0 + (i / NX) * (x1 - x0));
  for (let j = 0; j <= NY; j += 1) ys.push((j / NY) * CHART_H);

  const raw: number[][] = [];
  let lo = Infinity;
  let hi = -Infinity;
  for (let j = 0; j <= NY; j += 1) {
    const row: number[] = [];
    for (let i = 0; i <= NX; i += 1) {
      const h = bedAt((xs[i] - x0) / (x1 - x0), ys[j] / CHART_H);
      row.push(h);
      if (h < lo) lo = h;
      if (h > hi) hi = h;
    }
    raw.push(row);
  }
  const span = hi - lo || 1;
  const z = raw.map((row) => row.map((h) => (h - lo) / span));
  return { xs, ys, z };
};

let fieldCache: ReturnType<typeof buildField> | null = null;
const field = () => (fieldCache ??= buildField());

/**
 * Marching squares. Returns the isoline at `level` as polylines, stitched so
 * each line renders as one stroked path with proper joins rather than a few
 * hundred loose segments.
 */
function contourAt(level: number): Pt[][] {
  const { xs, ys, z } = field();
  const segs: Array<[Pt, Pt]> = [];
  const mix = (a: Pt, b: Pt, va: number, vb: number): Pt => {
    const t = (level - va) / (vb - va || 1);
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  };

  for (let j = 0; j < NY; j += 1) {
    for (let i = 0; i < NX; i += 1) {
      const v00 = z[j][i];
      const v10 = z[j][i + 1];
      const v11 = z[j + 1][i + 1];
      const v01 = z[j + 1][i];
      let code = 0;
      if (v00 > level) code |= 8;
      if (v10 > level) code |= 4;
      if (v11 > level) code |= 2;
      if (v01 > level) code |= 1;
      if (code === 0 || code === 15) continue;

      const p00: Pt = [xs[i], ys[j]];
      const p10: Pt = [xs[i + 1], ys[j]];
      const p11: Pt = [xs[i + 1], ys[j + 1]];
      const p01: Pt = [xs[i], ys[j + 1]];
      const top = () => mix(p00, p10, v00, v10);
      const right = () => mix(p10, p11, v10, v11);
      const bottom = () => mix(p01, p11, v01, v11);
      const left = () => mix(p00, p01, v00, v01);

      switch (code) {
        case 1:
        case 14:
          segs.push([left(), bottom()]);
          break;
        case 2:
        case 13:
          segs.push([bottom(), right()]);
          break;
        case 3:
        case 12:
          segs.push([left(), right()]);
          break;
        case 4:
        case 11:
          segs.push([top(), right()]);
          break;
        case 6:
        case 9:
          segs.push([top(), bottom()]);
          break;
        case 7:
        case 8:
          segs.push([left(), top()]);
          break;
        /* The two saddle cases: two disjoint crossings in one cell. Resolved
           the same way every time, so neighbouring cells always agree. */
        case 5:
          segs.push([left(), top()], [bottom(), right()]);
          break;
        default:
          segs.push([left(), bottom()], [top(), right()]);
          break;
      }
    }
  }

  const key = (p: Pt) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
  const byStart = new Map<string, Array<[Pt, Pt]>>();
  for (const s of segs) {
    const k = key(s[0]);
    const bucket = byStart.get(k);
    if (bucket) bucket.push(s);
    else byStart.set(k, [s]);
  }
  const used = new Set<[Pt, Pt]>();
  const lines: Pt[][] = [];
  for (const s of segs) {
    if (used.has(s)) continue;
    used.add(s);
    const line: Pt[] = [s[0], s[1]];
    for (;;) {
      const bucket = byStart.get(key(line[line.length - 1]));
      const next = bucket?.find((c) => !used.has(c));
      if (!next) break;
      used.add(next);
      line.push(next[1]);
    }
    if (line.length > 2) lines.push(line);
  }
  return lines;
}

const toPath = (lines: Pt[][]) =>
  lines.map((l) => `M${l.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L')}`).join('');

/** The eleven fixed contours. Computed once, the first time the chart draws. */
let contourCache: Array<{ level: number; d: string }> | null = null;
function contourPaths() {
  if (!contourCache) {
    contourCache = [];
    for (let k = 0; k < CONTOURS; k += 1) {
      const level = (k + 0.5) / CONTOURS;
      contourCache.push({ level, d: toPath(contourAt(level)) });
    }
  }
  return contourCache;
}

/**
 * Where the waterline sits in the field for a given tide.
 *
 * Bounded to the middle of the range on purpose: the top of the field is the
 * open-water end and the bottom is high ground, and a waterline that ran off
 * either end would stop being a line you can see moving.
 */
const WATER_MIN = 0.52;
const WATER_MAX = 0.78;

/**
 * The live tide as a 0..1 position between the lowest and highest predicted
 * water in the snapshot — 0 is the low, 1 is the high. Returns null when there
 * is no live snapshot, and the hero then draws a mid-tide waterline and says
 * that is what it is.
 */
export function tideLevel(tides: TideEvent[] | undefined, phase: TidePhase | null): number | null {
  if (!phase) return null;
  const hs = (tides ?? []).map((t) => t.height_ft).filter((h) => Number.isFinite(h));
  const h = phase.height_ft;
  if (h !== null && h !== undefined && hs.length >= 2) {
    const lo = Math.min(...hs);
    const hi = Math.max(...hs);
    if (hi > lo) return Math.min(1, Math.max(0, (h - lo) / (hi - lo)));
  }
  // No usable heights: fall back to the stage, which is always known.
  const p = Math.min(1, Math.max(0, phase.progress));
  if (phase.stage === 'low') return 0.06;
  if (phase.stage === 'high') return 0.94;
  return phase.stage === 'incoming' ? 0.15 + p * 0.7 : 0.85 - p * 0.7;
}

/**
 * The home hero's chart plate: a schematic bathymetry with one live contour.
 *
 * Every thin line is a depth contour. The lime line is the one contour that
 * matters right now — the water's edge at the tide the reference station is
 * predicting — so as the tide fills it walks shoreward across the plate and
 * the ground it uncovers goes to a dashed drying line. That is the whole
 * argument of the guide in one drawing: the bottom never changes, the water
 * over it does, and where the two meet is where you fish.
 *
 * Decorative: the hero's own caption carries the words.
 */
export function HeroChart({ level }: { level: number | null }) {
  const water = WATER_MIN + (level ?? 0.5) * (WATER_MAX - WATER_MIN);
  const waterline = useMemo(() => toPath(contourAt(Math.round(water * 200) / 200)), [water]);
  const gid = useId();
  const wipe = `${gid}w`;

  return (
    <svg
      className="hero-chart"
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor={C.deep} />
          <stop offset="0.52" stopColor={C.mid} />
          <stop offset="1" stopColor={C.shallow} />
        </linearGradient>
        {/* The waterline is revealed left to right on load — the tide coming
            in. A clip wipe rather than a dash offset because the contour is
            several disjoint lines and a dash pattern would pop them all at
            once. */}
        <clipPath id={wipe} clipPathUnits="userSpaceOnUse">
          <rect className="hero-wipe" x={-CHART_PAD} y="0" width={CHART_W + CHART_PAD * 2} height={CHART_H} />
        </clipPath>
      </defs>
      <rect width={CHART_W} height={CHART_H} fill={`url(#${gid})`} />
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {contourPaths().map(({ level: l, d }) =>
          l > water ? (
            /* Higher than the water surface — bottom that is out of the water
               at this tide. Charted the way a chart draws it: a drying line. */
            <path
              key={l}
              d={d}
              stroke={C.pale}
              strokeWidth="1"
              strokeDasharray="2.5 3.5"
              opacity="0.26"
              vectorEffect="non-scaling-stroke"
            />
          ) : (
            <path
              key={l}
              d={d}
              stroke={C.wash}
              strokeWidth="1"
              opacity={(0.34 + l * 0.44).toFixed(2)}
              vectorEffect="non-scaling-stroke"
            />
          ),
        )}
        <g className="hero-swell" clipPath={`url(#${wipe})`}>
          <path
            d={waterline}
            stroke={C.lime}
            strokeWidth="9"
            opacity="0.12"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={waterline}
            stroke={C.lime}
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------- shoreline */

/**
 * The beach the hero stands on: the page colour cut into the bottom of the
 * chart along a generated shoreline, with the last waterline riding its crest.
 * Sampled from the same noise as the chart, so it is the same coast.
 */
const SHORE = (() => {
  const pts: Pt[] = [];
  for (let i = 0; i <= 40; i += 1) {
    const u = i / 40;
    const x = -20 + u * 440;
    const y =
      25 - 15 * (value2d(u * 5.5 + 0.3, 4.2) - 0.5) - 7 * (value2d(u * 13 + 7.1, 9.6) - 0.5);
    pts.push([x, y]);
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i += 1) {
    const a = pts[i - 1];
    const b = pts[i];
    const mx = ((a[0] + b[0]) / 2).toFixed(1);
    d += ` C ${mx} ${a[1].toFixed(1)}, ${mx} ${b[1].toFixed(1)}, ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
  }
  return d;
})();

/** The shoreline that closes the home hero. Purely decorative. */
export function HeroWave() {
  return (
    <svg
      className="hero-wave"
      viewBox="0 0 400 54"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Surf breaking over a bar just off the beach, then the beach itself.
          A pale band rather than a dark one, so it reads on both themes. */}
      <path d={`${SHORE} L 420 60 L -20 60 Z`} fill={C.pale} opacity=".14" transform="translate(16 -12)" />
      <path d={`${SHORE} L 420 54 L -20 54 Z`} fill="var(--bg)" />
      <path
        d={SHORE}
        fill="none"
        stroke={C.lime}
        strokeWidth="1"
        opacity=".5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Right-chevron affordance used on tappable rows. */
export function Chevron() {
  return (
    <span className="mut" aria-hidden="true">
      ›
    </span>
  );
}

/* -------------------------------------------------------------- habitats */

/**
 * Habitat glyphs — five cross-sections through the same piece of coast.
 *
 * They share one grammar so the row reads as a set rather than five drawings:
 * the same air band, the same water surface at y = 12, the same water colour,
 * and the same lime dashed line for "the edge you fish", which is the meaning
 * lime already carries in the location structure maps and their legend. What
 * differs between them is the only thing that actually differs on the water —
 * the shape of the bottom and what is standing on it.
 *
 * Cross-section rather than plan view because the thing a beginner needs to
 * see is depth: how much water is over the bar, how far the roots reach, where
 * the bottom drops out of the cut.
 */
const SURFACE_Y = 12;

/** Shared water body + surface line, drawn under every habitat's own bottom. */
function Water() {
  return (
    <>
      <rect y={SURFACE_Y} width="74" height={58 - SURFACE_Y} fill={C.shallow} />
      <path d={`M0 ${SURFACE_Y} H74`} stroke={C.surface} strokeWidth="1.4" />
    </>
  );
}

/** The lime "edge you fish" line, one style for all five glyphs. */
function Seam({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={C.lime}
      strokeWidth="1.7"
      strokeDasharray="3 2.6"
      strokeLinecap="round"
    />
  );
}

/** Small angular chips, so shell reads rough rather than moulded. */
function chips(pts: Array<[number, number]>, scale = 1) {
  return pts.map(([x, y], i) => {
    const f = i % 2 ? -1 : 1;
    const s = scale;
    return (
      <path
        key={`${x}-${y}`}
        d={`M${x - 2.4 * s} ${y + 1.3 * s} L${x - 0.9 * s * f} ${y - 1.5 * s} L${x + 1.1 * s * f} ${y - 0.5 * s} L${x + 2.4 * s} ${y + 1.3 * s} Z`}
        fill={i % 3 === 1 ? C.sand : C.shell}
      />
    );
  });
}

const HABITAT_GLYPHS: Record<string, ReactElement> = {
  /* A shell ridge built up off a soft bottom: gentle on the up-current side,
     steep on the down-current side, crown near the surface. The seam runs down
     the steep face, which is the edge the guide sends you to. */
  oyster: (
    <>
      <rect width="74" height="58" fill={C.deep} />
      <Water />
      <path d="M0 58 L0 50 C 22 49, 44 52, 74 48 L74 58 Z" fill={C.mid} />
      <path d="M6 52 L13 46 L18 41 L23 39 L27 34 L32 32 L37 30 L42 32 L45 37 L48 44 L49 52 Z" fill={C.piling} />
      {chips(
        [
          [13, 46],
          [18, 41.5],
          [23, 39],
          [27.5, 35],
          [32, 32.5],
          [37, 30.5],
          [41.5, 32.5],
          [45, 38],
          [47.5, 44],
          [20, 46],
          [34, 37],
        ],
        0.85,
      )}
      <Seam d="M42 30 C 47 35, 51 43, 52 54" />
    </>
  ),

  /* Turtle grass with one bare sand pothole cut through it — the light/dark
     boundary the guide tells you to retrieve across. */
  grass: (
    <>
      <rect width="74" height="58" fill={C.deep} />
      <Water />
      <path d="M0 58 L0 45 C 16 44, 30 46, 40 46 C 52 47, 64 44, 74 43 L74 58 Z" fill={C.grass} />
      <path d="M25 46 C 29 53, 47 53, 51 44 C 44 42, 31 43, 25 46 Z" fill={C.sand} />
      {[2, 6, 10, 14, 18, 22, 54, 58, 62, 66, 70, 73].map((x, i) => (
        <path
          key={x}
          d={`M${x} 45.5 Q ${x + (i % 2 ? 1.2 : -1.2)} 40 ${x + (i % 2 ? 2.6 : -2.6)} 35.5`}
          stroke={i % 3 === 1 ? C.weed : C.grass}
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <Seam d="M23 45 C 27 54, 49 54, 53 43" />
    </>
  ),

  /* A shoreline corner: canopy over the water, prop roots reaching through it,
     the bottom falling away to open water on the right. */
  mangrove: (
    <>
      <rect width="74" height="58" fill={C.deep} />
      <Water />
      <path d="M0 58 L0 51 C 22 52, 48 55, 74 53 L74 58 Z" fill={C.mid} />
      <path d="M0 58 L0 29 C 8 31, 15 39, 19 50 L21 58 Z" fill={C.mangrove} />
      <path d="M0 0 H34 C 33 7, 27 13, 16 16 L0 18 Z" fill={C.grass} />
      <path d="M0 9 C 11 10, 22 12, 29 10 C 25 14, 18 16, 0 18 Z" fill={C.mangrove} />
      {[
        'M5 17 C 6 24, 5 31, 3 39',
        'M12 17 C 14 24, 14 32, 12 42',
        'M19 16 C 22 23, 24 32, 22 45',
        'M26 14 C 30 21, 32 31, 29 47',
      ].map((d) => (
        <path key={d} d={d} stroke={C.scrub} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      ))}
      <Seam d="M33 15 C 36 25, 36 37, 33 51" />
    </>
  ),

  /* Night at a bridge: the deck, two pilings, and the hard edge a light throws
     across the water. The dashed line is that edge — the shadow line. */
  bridge: (
    <>
      <rect width="74" height="58" fill={C.deep} />
      <Water />
      <path d="M0 58 L0 51 C 24 50, 50 51, 74 49 L74 58 Z" fill={C.mid} />
      <path d="M46 12 L74 58 L29 58 Z" fill={C.pale} opacity=".34" />
      <rect x="0" y={SURFACE_Y} width="29" height={58 - SURFACE_Y} fill={C.deep} opacity=".42" />
      <rect x="14" y="9" width="9" height="43" fill={C.built} />
      <rect x="52" y="9" width="9" height="43" fill={C.piling} />
      <rect x="0" y="0" width="74" height="9" fill={C.built} />
      <rect x="0" y="0" width="74" height="2.5" fill={C.piling} />
      <circle cx="46" cy="11.5" r="2.6" fill={C.lime} />
      <Seam d="M45 14 L30 56" />
    </>
  ),

  /* A cut between two bars: the bottom drops out of the middle, the fast water
     runs through it, and the seams are on the faces of the bars either side. */
  pass: (
    <>
      <rect width="74" height="58" fill={C.deep} />
      <Water />
      <path d="M0 58 L0 31 C 9 32, 16 37, 21 48 L23 58 Z" fill={C.sand} />
      <path d="M74 58 L74 29 C 65 30, 57 35, 52 48 L50 58 Z" fill={C.sand} />
      <Seam d="M0 31 C 9 32, 16 37, 21 48 L23 58" />
      <Seam d="M74 29 C 65 30, 57 35, 52 48 L50 58" />
      <path
        d="M27 22 H48 M43 18 L48 22 L43 26"
        stroke={C.lime}
        strokeWidth="2.1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 41 H24 M28 37 L24 41 L28 45"
        stroke={C.surface}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
};

/** Cross-section for a habitat row. Falls back to plain water. */
export function HabitatGlyph({ id }: { id: string }) {
  return (
    <svg
      className="habglyph"
      viewBox="0 0 74 58"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {HABITAT_GLYPHS[id] ?? (
        <>
          <rect width="74" height="58" fill={C.deep} />
          <Water />
        </>
      )}
    </svg>
  );
}

/* ----------------------------------------------------------- tide stages */

/**
 * Tide-stage glyphs — one bank, four water levels.
 *
 * A water line drawn on its own says nothing: halfway up a box is halfway
 * between what? So every glyph carries the range it is being measured
 * against — a staff on the right marked at the day's high and low, with the
 * current level ticked on it — and the same bank in all four, so the shell on
 * the crest is plainly under water at the high and out in the air at the low.
 * Level is read from the line and the staff; the arrow says which way the
 * water is going; colour only says whether this stage is one the location
 * fishes best, and the row's own text says that too.
 */
const WATER_LEVEL: Record<TideStage, number> = { high: 12, outgoing: 19, incoming: 25, low: 31 };
const HIGH_Y = 12;
const LOW_Y = 31;

/** The bottom, and the bar standing on it. Identical in all four glyphs. */
const BED = 'M0 44 L0 38 C 12 37, 30 39.5, 52 37.5 L52 44 Z';
const BAR = 'M5 38.5 C 8 26, 12 17.5, 18.5 17.3 C 25 17.1, 29 26, 32.5 38.5 Z';
const BAR_EDGE = 'M5 38.5 C 8 26, 12 17.5, 18.5 17.3 C 25 17.1, 29 26, 32.5 38.5';
/** Shell along the crest — the thing that is under water at one stage and in the air at another. */
const CREST: Array<[number, number]> = [
  [10.5, 23.5],
  [14, 19.4],
  [19, 17.8],
  [23, 19.3],
];

function Crest() {
  return (
    <>
      {CREST.map(([cx, cy]) => (
        <path
          key={cx}
          d={`M${cx - 2.1} ${cy + 1.2} L${cx - 0.8} ${cy - 1.4} L${cx + 0.7} ${cy - 0.6} L${cx + 2.1} ${cy + 1.2} Z`}
          fill={C.shell}
        />
      ))}
    </>
  );
}

export function TideStageGlyph({ stage, prime }: { stage: TideStage; prime: boolean }) {
  const y = WATER_LEVEL[stage];
  const moving = stage === 'incoming' || stage === 'outgoing';
  const line = prime ? C.lime : C.surface;
  const dry = `${useId()}dry`;

  return (
    <svg
      className="tideglyph"
      viewBox="0 0 52 44"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Everything above the water surface, so the part of the bar that is
            out of the water can be redrawn over the water — which is also what
            breaks the surface line where the bar stands through it. */}
        <clipPath id={dry}>
          <rect width="52" height={y} />
        </clipPath>
      </defs>
      <rect width="52" height="44" fill={C.deep} />
      <path d={BED} fill={C.mangrove} />
      <path d={BAR} fill={C.grass} />
      <Crest />
      {/* the water, translucent, so covered ground still reads as ground */}
      <rect y={y} width="52" height={44 - y} fill={C.shallow} opacity=".7" />
      <path d={`M0 ${y} H44`} stroke={line} strokeWidth="2" strokeLinecap="round" />
      <g clipPath={`url(#${dry})`}>
        <path d={BAR} fill={C.grass} />
        <path d={BAR_EDGE} fill="none" stroke={C.weed} strokeWidth="1.2" />
        <Crest />
      </g>
      {/* the staff: the day's high and low, and where this stage sits on it */}
      <g stroke={C.piling} strokeWidth="0.9" strokeLinecap="round" opacity=".9">
        <path d={`M45.5 ${HIGH_Y} H50.5`} />
        <path d={`M45.5 ${LOW_Y} H50.5`} />
        <path d={`M48 ${HIGH_Y} V${LOW_Y}`} />
      </g>
      <rect x="45.5" y={y - 0.9} width="5" height="1.8" rx=".9" fill={line} />
      {/* flow annotation, always in the same slot above the highest water */}
      {moving ? (
        <path
          d={
            stage === 'incoming'
              ? 'M40 6 H26 M30 2.5 L26 6 L30 9.5'
              : 'M26 6 H40 M36 2.5 L40 6 L36 9.5'
          }
          stroke={line}
          strokeWidth="1.9"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        /* slack: no arrow, a flat ripple instead */
        <g stroke={C.surface} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".85">
          <path d="M26 4.5 q 3.5 -2 7 0 t 7 0" />
          <path d="M26 8.5 q 3.5 -2 7 0 t 7 0" />
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------ tide curve */

/** Drawing width before the slot has been measured (and in any non-DOM env). */
const MIN_W = 320;
const TOP = 10;
const BOTTOM = 50;
/** Baseline for the time-axis labels beneath the curve. */
const AXIS_Y = 68;
const H = 78;
/** Narrowest gap, in px, two axis labels can sit at without colliding. */
const LABEL_GAP = 62;

function cosineAt(y0: number, y1: number, u: number) {
  return y0 + (y1 - y0) * ((1 - Math.cos(Math.PI * u)) / 2);
}

/**
 * Measured width of the card slot, in CSS pixels.
 *
 * The curve was previously drawn into a fixed 320-unit viewBox stretched to
 * the card with `preserveAspectRatio="none"`. That scales the two axes by
 * different factors, and text suffers worst: on a 900px-wide card the axis
 * labels were stretched 2.8x horizontally against 1x vertically, which is the
 * smeared type visible on desktop. Measuring the slot keeps one user unit
 * equal to one CSS pixel, so glyphs render at their true size and the extra
 * width goes into the curve, where it earns something.
 *
 * jsdom has no ResizeObserver: the fallback keeps tests, and any environment
 * without one, rendering a correct (if narrow) chart rather than nothing.
 */
function useSlotWidth(fallback: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      if (w > 0) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

/**
 * Predicted tide curve for the reference station, drawn from the real NOAA
 * high/low events in the snapshot. Renders nothing without at least two
 * events — an undrawable curve must not be faked with a decorative wave.
 */
export function TideCurve({
  tides,
  phase,
  now = Date.now(),
}: {
  tides: TideEvent[];
  phase: TidePhase | null;
  now?: number;
}) {
  const gradientId = useId();
  const { ref, width } = useSlotWidth(MIN_W);
  const W = Math.max(MIN_W, Math.round(width));

  const allPts = tides
    .map((t) => ({ t: Date.parse(t.time), h: t.height_ft, type: t.type, raw: t.time }))
    .filter((p) => Number.isFinite(p.t) && Number.isFinite(p.h))
    .sort((a, b) => a.t - b.t);

  // The station cache holds a 96-hour window (~16 hi/lo events) so the "now"
  // marker always has data on both sides even right after a refresh. Plotting
  // all of it crams the curve into several barely-legible cycles and stacks a
  // dozen time labels on top of each other. A live glance card needs the one
  // event before `now` for context plus the next day and a half: enough to
  // read the tide you are standing in and plan the next one or two, and no
  // more. Gulf stations run mixed and sometimes diurnal, so this is bounded
  // by elapsed time rather than by a count of turns — six events can be a day
  // and a half at one station and three days at another.
  const FORECAST_MS = 36 * 60 * 60 * 1000;
  const beforeIdx = allPts.reduce((acc, p, i) => (p.t <= now ? i : acc), -1);
  const startIdx = Math.max(0, beforeIdx);
  const pts = allPts.slice(startIdx).filter((p, i) => i === 0 || p.t <= now + FORECAST_MS);

  if (pts.length < 2) return null;

  const t0 = pts[0].t;
  const t1 = pts[pts.length - 1].t;
  const span = t1 - t0 || 1;
  const hs = pts.map((p) => p.h);
  const lo = Math.min(...hs);
  const hi = Math.max(...hs);
  const range = hi - lo || 1;

  const x = (t: number) => ((t - t0) / span) * W;
  const y = (h: number) => BOTTOM - ((h - lo) / range) * (BOTTOM - TOP);

  const xy = pts.map((p) => ({ x: x(p.t), y: y(p.h) }));
  let d = `M${xy[0].x.toFixed(1)} ${xy[0].y.toFixed(1)}`;
  for (let i = 1; i < xy.length; i += 1) {
    const a = xy[i - 1];
    const b = xy[i];
    const mid = (a.x + b.x) / 2;
    d += ` C ${mid.toFixed(1)} ${a.y.toFixed(1)}, ${mid.toFixed(1)} ${b.y.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }

  // "Now" marker, only while now sits inside the predicted window.
  let marker: { x: number; y: number } | null = null;
  if (now >= t0 && now <= t1) {
    const i = pts.findIndex((p) => p.t >= now);
    const hiIdx = i <= 0 ? 1 : i;
    const a = pts[hiIdx - 1];
    const b = pts[hiIdx];
    const u = (now - a.t) / (b.t - a.t || 1);
    marker = { x: x(now), y: cosineAt(y(a.h), y(b.h), u) };
  }

  // One label per predicted event, so the axis reads "what time is this point"
  // rather than an evenly-spaced grid unrelated to the data. Each carries its
  // H/L, because a peak and a trough are the only two things on this chart and
  // naming them is what turns a wave into a reading.
  const all = pts
    .map((p, i) => ({ x: xy[i].x, clock: stationClock(p.raw), type: p.type }))
    .filter((l): l is { x: number; clock: string; type: 'H' | 'L' } => l.clock !== null);

  // Thin the axis when the slot is too narrow to hold every turn. The final
  // label is always kept: the right edge is where "how far ahead does this go"
  // gets read, and a dropped one silently shortens the chart's apparent reach.
  const axisLabels: typeof all = [];
  for (const l of all) {
    const last = axisLabels[axisLabels.length - 1];
    if (!last || l.x - last.x >= LABEL_GAP) axisLabels.push(l);
  }
  const final = all[all.length - 1];
  if (final && axisLabels[axisLabels.length - 1] !== final) {
    while (
      axisLabels.length > 0 &&
      final.x - axisLabels[axisLabels.length - 1].x < LABEL_GAP
    ) {
      axisLabels.pop();
    }
    axisLabels.push(final);
  }

  const label = phase
    ? `Predicted tide curve for the reference station over the next 36 hours; the tide is ${phase.stage} now. ${all
        .map((l) => `${l.type === 'H' ? 'High' : 'Low'} ${l.clock}`)
        .join(', ')}.`
    : `Predicted tide curve for the reference station over the next 36 hours. ${all
        .map((l) => `${l.type === 'H' ? 'High' : 'Low'} ${l.clock}`)
        .join(', ')}.`;

  return (
    <div ref={ref} style={{ marginTop: 10 }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', width: '100%', height: H }} role="img" aria-label={label}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8dff00" stopOpacity=".30" />
            <stop offset="1" stopColor="#8dff00" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${d} L ${W} ${BOTTOM} L 0 ${BOTTOM} Z`} fill={`url(#${gradientId})`} />
        <path d={d} fill="none" stroke="var(--link)" strokeWidth="2" />
        {/* A dot at every turn, including the ones whose label was thinned:
            the point stays visible even when its time has to go. */}
        {xy.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="var(--link)" />
        ))}
        {marker && (
          <>
            <line
              x1={marker.x}
              y1="0"
              x2={marker.x}
              y2={BOTTOM}
              stroke="var(--lime)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <circle cx={marker.x} cy={marker.y} r="5" fill="var(--lime)" />
          </>
        )}
        <line x1="0" y1={BOTTOM} x2={W} y2={BOTTOM} stroke="var(--l)" strokeWidth="1" />
        {axisLabels.map((l, i) => (
          <g key={`${l.clock}-${l.x.toFixed(0)}`}>
            <line
              x1={l.x}
              y1={BOTTOM}
              x2={l.x}
              y2={BOTTOM + 4}
              stroke="var(--m)"
              strokeWidth="1"
            />
            <text
              x={i === 0 ? Math.max(l.x, 2) : i === axisLabels.length - 1 ? Math.min(l.x, W - 2) : l.x}
              y={AXIS_Y}
              textAnchor={i === 0 ? 'start' : i === axisLabels.length - 1 ? 'end' : 'middle'}
              fontFamily="var(--ff-mono)"
              fontSize="9.5"
              fill="var(--m)"
            >
              {l.type === 'H' ? 'H' : 'L'} {l.clock}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
