import { useState } from 'react';
import type { ReactNode } from 'react';
import type { MediaRef } from '../../data';
import { placeMarks } from './idPlateGeometry';

interface PlateProps {
  /** Licensed/hotlinked photo for this slot. Null renders the empty slot. */
  media?: MediaRef | null;
  /** Shot brief shown in the caption chip (design convention: mono, lowercase). */
  caption?: string;
  className?: string;
  /** Extra content layered over the plate (numbered marks, chips...). */
  children?: ReactNode;
  /** Presentational only — skips the caption chip. */
  bare?: boolean;
}

/**
 * Imagery slot from the design system (§12).
 *
 * A plate is a slot for licensed photography. When a real image is present it
 * fills the plate; if the media is missing OR the remote host drops the request
 * we fall back to the dashed placeholder treatment plus the shot brief, so an
 * unlicensed/broken image never reads as content. Alt text always comes from
 * the MediaRef — decorative plates must pass `alt: ''` in the data.
 */
export function Plate({ media, caption, className = '', children, bare }: PlateProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(media?.url) && !failed;

  return (
    <div className={`plate ${showImage ? '' : 'plate--empty'} ${className}`.trim()}>
      {showImage && media && (
        <img src={media.url} alt={media.alt} loading="lazy" onError={() => setFailed(true)} />
      )}
      {children}
      {!bare && caption && <span className="plate-cap">{caption}</span>}
    </div>
  );
}

export interface IdMark {
  /** Number shown in the lime pin — the shared "numbered zone" convention. */
  n: number;
  /**
   * Percentage offsets of the feature *within the photograph*. This is the
   * verified position of the anatomical feature on that species' photo — the
   * layout in `idPlateGeometry.ts` reads it and never rewrites it.
   */
  top: string;
  left: string;
  /** Screen-reader description of what this mark points at. */
  label: string;
}

interface IdPlateProps {
  media?: MediaRef | null;
  marks: IdMark[];
  className?: string;
}

const pct = (v: number) => `${v}%`;

/**
 * Annotated photo plate for species / hazard identification (design system
 * "annotated-photo-placeholder" approach — we annotate a real photo slot rather
 * than drawing an illustration). The numbered marks share the same numbering
 * convention as casting zones and tide stages.
 *
 * The photo sits in a gutter, and each mark is drawn as three things: a small
 * dot on the exact feature, a numbered pin out in the gutter, and a leader line
 * between them. Pins never sit on the fish, which is the whole point — a disc
 * big enough to read is a disc big enough to hide the feature it names.
 * `idPlateGeometry.placeMarks` decides where each pin goes.
 */
export function IdPlate({ media, marks, className = '' }: IdPlateProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(media?.url) && !failed;
  const placed = placeMarks(marks);

  return (
    <figure style={{ margin: 0 }}>
      <div className={`idplate ${className}`.trim()}>
        <div className={`idphoto ${showImage ? '' : 'idphoto--empty'}`.trim()}>
          {showImage && media && (
            <img src={media.url} alt={media.alt} loading="lazy" onError={() => setFailed(true)} />
          )}
        </div>
        {placed.length > 0 && (
          <svg className="idleaders" aria-hidden="true" focusable="false">
            {placed.map((p) => (
              <g key={p.n}>
                {/* Dark casing under the lime stroke so the leader survives a
                    pale patch of photograph. */}
                <line
                  className="lead-cas"
                  x1={pct(p.fx)}
                  y1={pct(p.fy)}
                  x2={pct(p.px)}
                  y2={pct(p.py)}
                />
                <line
                  className="lead"
                  x1={pct(p.fx)}
                  y1={pct(p.fy)}
                  x2={pct(p.px)}
                  y2={pct(p.py)}
                />
                <circle className="lead-dot" cx={pct(p.fx)} cy={pct(p.fy)} r="3.5" />
              </g>
            ))}
          </svg>
        )}
        {placed.map((p) => (
          <span
            key={p.n}
            className="mark"
            style={{ left: pct(p.px), top: pct(p.py) }}
            aria-hidden="true"
          >
            {p.n}
          </span>
        ))}
      </div>
      {marks.length > 0 && (
        <figcaption className="vh">
          Identification marks: {marks.map((m) => `${m.n}. ${m.label}`).join('. ')}.
        </figcaption>
      )}
    </figure>
  );
}

export default Plate;
