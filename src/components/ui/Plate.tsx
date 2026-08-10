import { useState } from 'react';
import type { ReactNode } from 'react';
import type { MediaRef } from '../../data';

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
  /** Percentage offsets within the plate (marks live in the top ~62%). */
  top: string;
  left: string;
  /** Screen-reader description of what this mark points at. */
  label: string;
}

interface IdPlateProps {
  media?: MediaRef | null;
  caption: string;
  marks: IdMark[];
  className?: string;
}

/**
 * Annotated photo plate for species / hazard identification (design system
 * "annotated-photo-placeholder" approach — we annotate a real photo slot rather
 * than drawing an illustration). The numbered marks share the same numbering
 * convention as casting zones and tide stages.
 */
export function IdPlate({ media, caption, marks, className = '' }: IdPlateProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(media?.url) && !failed;

  return (
    <figure style={{ margin: 0 }}>
      <div className={`idplate ${showImage ? '' : 'idplate--empty'} ${className}`.trim()}>
        {showImage && media && (
          <img src={media.url} alt={media.alt} loading="lazy" onError={() => setFailed(true)} />
        )}
        {marks.map((m) => (
          <span key={m.n} className="mark" style={{ top: m.top, left: m.left }} aria-hidden="true">
            {m.n}
          </span>
        ))}
        <span className="cap">{caption}</span>
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
