/**
 * Inline SVG art for the Home and Location screens (design boards 01 and 02).
 *
 * Everything here is drawn from the brand ramps only (blue --b*, lime --g*,
 * neutral --n*) and every shape is either decorative (`aria-hidden`) or paired
 * with visible text, so colour is never the sole carrier of meaning.
 */
import { useId } from 'react';
import type { ReactElement } from 'react';
import { stationClock } from '../../lib/conditions';
import type { TideEvent, TidePhase } from '../../lib/conditions';
import type { TideStage } from '../../data';

/* ------------------------------------------------------------------ hero */

/** The drifting wave that closes the home hero. Purely decorative. */
export function HeroWave() {
  return (
    <svg
      className="hero-wave drift"
      viewBox="0 0 400 54"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 30 C 60 12, 110 44, 170 30 S 290 12, 340 30 S 400 40, 420 30 L 420 54 L 0 54 Z"
        fill="var(--bg)"
        opacity=".55"
      />
      <path
        d="M-20 40 C 50 26, 120 52, 190 40 S 320 26, 380 40 L 420 40 L 420 54 L -20 54 Z"
        fill="var(--bg)"
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

const HABITAT_GLYPHS: Record<string, ReactElement> = {
  oyster: (
    <>
      <rect width="74" height="58" fill="#052a63" />
      <rect y="36" width="74" height="22" fill="#0746a3" />
      <path d="M10 40 L20 30 L32 34 L44 28 L58 33 L66 40 Z" fill="#9eb0c3" />
      <path d="M8 44 H66" stroke="#8dff00" strokeWidth="2" strokeDasharray="4 3" />
    </>
  ),
  grass: (
    <>
      <rect width="74" height="58" fill="#2a4d00" />
      <ellipse cx="26" cy="22" rx="11" ry="8" fill="#c4d2e0" />
      <ellipse cx="50" cy="38" rx="14" ry="9" fill="#c4d2e0" />
      <path d="M6 46 Q 30 30 68 16" stroke="#8dff00" strokeWidth="2" fill="none" strokeDasharray="4 3" />
    </>
  ),
  mangrove: (
    <>
      <rect width="74" height="58" fill="#0746a3" />
      <path d="M0 0 H46 Q 40 26 20 34 L0 40 Z" fill="#2a4d00" />
      <circle cx="52" cy="30" r="4" fill="#8dff00" />
      <path d="M56 44 Q 44 34 38 22" stroke="#8dff00" strokeWidth="2" fill="none" strokeDasharray="4 3" />
    </>
  ),
  bridge: (
    <>
      <rect width="74" height="58" fill="#031530" />
      <rect x="0" y="18" width="74" height="6" fill="#55677d" />
      <rect x="18" y="18" width="7" height="40" fill="#55677d" />
      <rect x="48" y="18" width="7" height="40" fill="#55677d" />
      <path d="M25 24 H48 V58 H25 Z" fill="#8dff00" opacity=".18" />
      <path d="M8 48 H66" stroke="#8dff00" strokeWidth="2" strokeDasharray="4 3" />
    </>
  ),
  /* Not on the boards — drawn to the same rules so the fifth habitat row
     does not fall back to a blank box. */
  pass: (
    <>
      <rect width="74" height="58" fill="#031530" />
      <path d="M0 0 H24 Q 20 26 8 40 L0 46 Z" fill="#2a4d00" />
      <path d="M74 0 H52 Q 56 24 66 38 L74 44 Z" fill="#2a4d00" />
      <rect x="24" y="0" width="26" height="58" fill="#0746a3" />
      <path d="M30 6 C 36 22, 32 38, 38 54" stroke="#8dff00" strokeWidth="2" fill="none" strokeDasharray="4 3" />
    </>
  ),
};

/** 74x58 schematic for a habitat row. Falls back to plain water. */
export function HabitatGlyph({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 74 58" width="74" height="58" aria-hidden="true" focusable="false">
      {HABITAT_GLYPHS[id] ?? <rect width="74" height="58" fill="#0746a3" />}
    </svg>
  );
}

/* ----------------------------------------------------------- tide stages */

const WATER_LEVEL: Record<TideStage, number> = { low: 32, incoming: 24, high: 14, outgoing: 22 };

/**
 * 52x44 glyph showing how much water is over the same piece of bottom at each
 * stage — the water line moves, the land does not.
 */
export function TideStageGlyph({ stage, prime }: { stage: TideStage; prime: boolean }) {
  const y = WATER_LEVEL[stage];
  const line = prime ? '#8dff00' : '#5b98f0';
  return (
    <svg viewBox="0 0 52 44" width="52" height="44" aria-hidden="true" focusable="false">
      <rect width="52" height="44" fill="#031530" rx="6" />
      <rect y={y} width="52" height={44 - y} fill="#0746a3" />
      <path d="M0 38 C 12 36, 20 32, 30 26 C 38 21, 44 14, 52 10 L52 44 L0 44 Z" fill="#16290a" />
      {stage === 'low' && <path d="M8 34 q 5 -6 10 0 z" fill="#9eb0c3" />}
      <path d={`M0 ${y} H52`} stroke={line} strokeWidth="2" />
      {stage === 'incoming' && (
        <path d="M20 16 H34 M30 12 L34 16 L30 20" stroke={line} strokeWidth="2" fill="none" />
      )}
      {stage === 'outgoing' && (
        <path d="M18 14 H32 M22 10 L18 14 L22 18" stroke={line} strokeWidth="2" fill="none" />
      )}
    </svg>
  );
}

/* ------------------------------------------------------------ tide curve */

const W = 320;
const TOP = 10;
const BOTTOM = 50;
/** Baseline for the time-axis labels beneath the curve. */
const AXIS_Y = 68;
const H = 78;

function cosineAt(y0: number, y1: number, u: number) {
  return y0 + (y1 - y0) * ((1 - Math.cos(Math.PI * u)) / 2);
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

  const allPts = tides
    .map((t) => ({ t: Date.parse(t.time), h: t.height_ft, type: t.type, raw: t.time }))
    .filter((p) => Number.isFinite(p.t) && Number.isFinite(p.h))
    .sort((a, b) => a.t - b.t);

  // The station cache holds a 96-hour window (~16 hi/lo events) so the "now"
  // marker always has data on both sides even right after a refresh. Plotting
  // all of it crams the curve into several barely-legible cycles and stacks a
  // dozen time labels on top of each other. A live glance card doesn't need
  // four days — the one event before `now` for context, plus everything in
  // the next 48 hours, is enough to read the current tide and plan the next
  // one or two without the axis turning into a smear.
  const FORECAST_MS = 48 * 60 * 60 * 1000;
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
  // rather than an evenly-spaced grid unrelated to the data. Anchor the end
  // labels inward so they never clip past the plate's edge.
  const axisLabels = pts
    .map((p, i) => ({ x: xy[i].x, clock: stationClock(p.raw) }))
    .filter((l): l is { x: number; clock: string } => l.clock !== null);

  const label = phase
    ? `Predicted tide curve for the reference station; the tide is ${phase.stage} now.`
    : 'Predicted tide curve for the reference station.';

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: 78, marginTop: 10 }}
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8dff00" stopOpacity=".30" />
          <stop offset="1" stopColor="#8dff00" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${W} ${BOTTOM} L 0 ${BOTTOM} Z`} fill={`url(#${gradientId})`} />
      <path d={d} fill="none" stroke="var(--link)" strokeWidth="2" />
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
        <g key={i}>
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
            fontSize="9"
            fill="var(--m)"
          >
            {l.clock}
          </text>
        </g>
      ))}
    </svg>
  );
}
