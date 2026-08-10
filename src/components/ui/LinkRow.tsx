import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * The design system's `.linkrow` — a full-width tappable row inside a `.card`.
 *
 * NOTE FOR THE ARCHITECT: this is generic page furniture and really belongs in
 * `src/components/ui/`, which this track does not own. It lives here so the
 * species, care and rigs screens share one implementation instead of three.
 *
 * The whole row is the hit target and `.linkrow` already clears 44px, so these
 * satisfy the tap-target rule without extra padding.
 */

interface RowBodyProps {
  /** Leading glyph — decorative, always paired with the visible title. */
  glyph?: string;
  title: ReactNode;
  note?: ReactNode;
}

function RowBody({ glyph, title, note }: RowBodyProps) {
  return (
    <div className="row g3">
      <span className="pl" aria-hidden="true">
        {glyph}
      </span>
      <div>
        <b>{title}</b>
        {note && <div className="mut xs">{note}</div>}
      </div>
    </div>
  );
}

/** Row that navigates inside the app. */
export function LinkRow({
  to,
  glyph = '›',
  title,
  note,
}: RowBodyProps & { to: string }) {
  return (
    <Link className="linkrow" to={to}>
      <RowBody glyph={glyph} title={title} note={note} />
      <span className="mut" aria-hidden="true">
        ›
      </span>
    </Link>
  );
}

/**
 * Row that leaves the app. Carries a visible ↗ affordance plus a screen-reader
 * "opens in a new tab" so the new-window behaviour is never a surprise.
 */
export function ExternalRow({
  href,
  glyph = '↗',
  title,
  note,
}: RowBodyProps & { href: string }) {
  return (
    <a className="linkrow" href={href} target="_blank" rel="noreferrer">
      <RowBody glyph={glyph} title={title} note={note} />
      <span className="mut" aria-hidden="true">
        ↗
      </span>
      <span className="vh">(opens in a new tab)</span>
    </a>
  );
}

/** Static row — same rhythm, nothing to click. */
export function InfoRow({ glyph = '⤳', title, note }: RowBodyProps) {
  return (
    <div className="linkrow">
      <RowBody glyph={glyph} title={title} note={note} />
    </div>
  );
}
