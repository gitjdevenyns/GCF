import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export { Plate, IdPlate } from './Plate';
export type { IdMark } from './Plate';

/* ---------------------------------------------------------------- section */

interface SectionTitleProps {
  children: ReactNode;
  /** Optional trailing link, e.g. "All 5". */
  to?: string;
  linkLabel?: string;
  /** Heading level — keeps the document outline correct on every page. */
  as?: 'h2' | 'h3';
  id?: string;
}

/** Design system title rule: heading + hairline + optional trailing link. */
export function SectionTitle({ children, to, linkLabel, as: Tag = 'h2', id }: SectionTitleProps) {
  return (
    <div className="sect-title">
      <Tag id={id}>{children}</Tag>
      <span className="rule" />
      {to && linkLabel && (
        <Link to={to} className="xs">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- callouts */

type CalloutTone = 'default' | 'info' | 'warn' | 'danger';

interface CalloutProps {
  tone?: CalloutTone;
  title?: string;
  children: ReactNode;
  className?: string;
}

const TONE_CLASS: Record<CalloutTone, string> = {
  default: '',
  info: 'callout--info',
  warn: 'callout--warn',
  danger: 'callout--danger',
};

export function Callout({ tone = 'default', title, children, className = '' }: CalloutProps) {
  return (
    <div className={`callout ${TONE_CLASS[tone]} ${className}`.trim()}>
      <div>
        {title && <b>{title}</b>}
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- skeletons */

/**
 * Loading placeholder. Renders the eventual text as visually-hidden-ish
 * transparent content so layout does not jump, and marks the region busy.
 */
export function Skeleton({
  width,
  block,
  className = '',
}: {
  width?: 4 | 6 | 8 | 12;
  block?: boolean;
  className?: string;
}) {
  const cls = block ? 'sk sk-block' : `sk sk-line${width ? ` sk-w${width}` : ''}`;
  return <span className={`${cls} ${className}`.trim()} aria-hidden="true" />;
}

/* --------------------------------------------------------- empty / error  */

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="state">
      <h3>{title}</h3>
      {children}
      {action}
    </div>
  );
}

/**
 * Non-fatal data failure. A production page must stay readable when a network
 * call fails, so this sits inline in place of the failed region — it never
 * replaces the whole page.
 */
export function ErrorState({
  title = 'Could not load live data',
  children,
  onRetry,
}: {
  title?: string;
  children?: ReactNode;
  onRetry?: () => void;
}) {
  return (
    <div className="state" role="status">
      <h3>{title}</h3>
      {children}
      {onRetry && (
        <button type="button" className="btn btn-ghost" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- freshness  */

export type Freshness = 'fresh' | 'stale' | 'offline' | 'unavailable';

const FRESHNESS_CLASS: Record<Freshness, string> = {
  fresh: '',
  stale: 'is-stale',
  offline: 'is-off',
  unavailable: 'is-off',
};

/** Honest provenance line under any live-data card. */
export function FreshnessNote({ state, children }: { state: Freshness; children: ReactNode }) {
  return (
    <p className={`freshness ${FRESHNESS_CLASS[state]}`.trim()}>
      <span className="dot" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
