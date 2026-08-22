import { useState } from 'react';
import { useReview } from './useReview';
import { KIND_LABEL, REVIEW_STATUSES, finalTextOf } from './review-types';
import type { ReviewKind, ReviewRow, ReviewStatus } from './review-types';

/**
 * The daily review surface: work the queue, a few items at a time.
 *
 * Designed around what actually stalls this kind of work. The queue leads with
 * items where the guide is currently *wrong*, because a closed dock outranks a
 * nice-to-have season note. Every proposal shows its sources with the quote
 * inline, so a decision needs no second tab. And "Rewrite" is a first-class
 * outcome next to Accept and Skip — most research is nearly right, and forcing
 * a binary on it means either publishing someone else's wording or throwing
 * away work that was 90% there.
 */

const STATUS_LABEL: Record<ReviewStatus, string> = {
  pending: 'To review',
  accepted: 'Accepted',
  rewritten: 'Rewritten',
  skipped: 'Skipped',
  needs_info: 'Needs info',
};

function Item({ row, decide }: { row: ReviewRow; decide: ReturnType<typeof useReview>['decide'] }) {
  const [draft, setDraft] = useState(finalTextOf(row));
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(row.note ?? '');
  const [open, setOpen] = useState(false);

  return (
    <article className={`rv rv--${row.status}${row.urgent ? ' rv--urgent' : ''}`}>
      <header className="rv-hd">
        <span className={`chip ${row.urgent ? 'chip-danger' : ''}`}>{KIND_LABEL[row.kind]}</span>
        <b className="rv-target">{row.target_label}</b>
        <span className={`chip conf conf--${row.confidence}`}>{row.confidence}</span>
        {row.time_sensitive && <span className="chip chip-warn">re-check before publish</span>}
        <span className={`rv-status rv-status--${row.status}`}>{STATUS_LABEL[row.status]}</span>
      </header>

      {editing ? (
        <textarea
          className="rv-edit" value={draft} rows={3}
          onChange={(e) => setDraft(e.target.value)}
          aria-label={`Rewrite text for ${row.target_label}`}
        />
      ) : (
        <p className="rv-proposed">{finalTextOf(row)}</p>
      )}

      {row.rationale && <p className="rv-why">{row.rationale}</p>}

      {row.sources.length > 0 && (
        <details open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
          <summary>{row.sources.length} source{row.sources.length === 1 ? '' : 's'}</summary>
          <ul className="rv-src">
            {row.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer">{s.publisher ?? s.url}</a>
                <blockquote>{s.quote}</blockquote>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="rv-actions">
        {editing ? (
          <>
            <button
              type="button" className="btn btn-lime"
              onClick={() => { decide(row.id, { status: 'rewritten', final_text: draft }); setEditing(false); }}
            >
              Save rewrite
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button" className="btn btn-lime"
              onClick={() => decide(row.id, { status: 'accepted', final_text: null })}
            >
              Accept
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(true)}>
              Rewrite
            </button>
            <button
              type="button" className="btn btn-ghost"
              onClick={() => decide(row.id, { status: 'skipped' })}
            >
              Skip
            </button>
            <button
              type="button" className="btn btn-ghost"
              onClick={() => decide(row.id, { status: 'needs_info' })}
            >
              Needs info
            </button>
            {row.status !== 'pending' && (
              <button
                type="button" className="iconbtn"
                onClick={() => decide(row.id, { status: 'pending', final_text: null })}
              >
                Undo
              </button>
            )}
          </>
        )}
      </div>

      <input
        className="rv-note" placeholder="Note to self — called them, ask FDOT, check on site…"
        value={note} onChange={(e) => setNote(e.target.value)}
        onBlur={() => note !== (row.note ?? '') && decide(row.id, { note })}
        aria-label={`Note for ${row.target_label}`}
      />

      <p className="rv-origin">{row.id} · from {row.origin}</p>
    </article>
  );
}

export default function Review() {
  const { rows, loading, error, decide, counts } = useReview();
  const [filter, setFilter] = useState<ReviewStatus | 'all'>('pending');
  const [kind, setKind] = useState<ReviewKind | 'all'>('all');

  const shown = rows.filter(
    (r) => (filter === 'all' || r.status === filter) && (kind === 'all' || r.kind === kind),
  );
  const kinds = [...new Set(rows.map((r) => r.kind))];
  const done = counts.total - counts.pending;

  return (
    <div className="rv-page">
      <h1 className="d2">Review queue</h1>

      {rows.length === 0 && !loading && (
        <p className="callout callout--info">
          No proposals loaded. Research lands in <code>docs/research/</code> and is
          transcribed into <code>src/admin/data/review-items.json</code>.
        </p>
      )}

      {error && <p className="callout callout--warn">{error}</p>}

      <div className="rv-progress">
        <div className="rv-bar" aria-hidden="true">
          <span style={{ width: `${counts.total ? (done / counts.total) * 100 : 0}%` }} />
        </div>
        <p className="mut">
          <b>{done}</b> of <b>{counts.total}</b> reviewed
          {counts.urgent > 0 && (
            <> · <b className="rv-alarm">{counts.urgent} correction{counts.urgent === 1 ? '' : 's'} still pending</b></>
          )}
        </p>
      </div>

      <div className="rv-filters">
        {(['pending', ...REVIEW_STATUSES.filter((s) => s !== 'pending'), 'all'] as const).map((s) => (
          <button
            key={s} type="button"
            className={`btn ${filter === s ? 'btn-lime' : 'btn-ghost'}`}
            onClick={() => setFilter(s as ReviewStatus | 'all')}
          >
            {s === 'all' ? `All (${counts.total})` : `${STATUS_LABEL[s as ReviewStatus]} (${counts[s as ReviewStatus]})`}
          </button>
        ))}
      </div>

      <div className="rv-filters">
        <button
          type="button" className={`btn ${kind === 'all' ? 'btn-lime' : 'btn-ghost'}`}
          onClick={() => setKind('all')}
        >
          Everything
        </button>
        {kinds.map((k) => (
          <button
            key={k} type="button"
            className={`btn ${kind === k ? 'btn-lime' : 'btn-ghost'}`}
            onClick={() => setKind(k)}
          >
            {KIND_LABEL[k]}
          </button>
        ))}
      </div>

      {loading && <p className="mut">Loading decisions…</p>}

      {!loading && shown.length === 0 && rows.length > 0 && (
        <p className="callout callout--info">
          Nothing here. {filter === 'pending' ? 'Queue is clear — nice.' : 'Try another filter.'}
        </p>
      )}

      <div className="rv-list">
        {shown.map((r) => <Item key={r.id} row={r} decide={decide} />)}
      </div>

      {counts.accepted + counts.rewritten > 0 && (
        <p className="callout callout--info rv-publish">
          <b>{counts.accepted + counts.rewritten} item{counts.accepted + counts.rewritten === 1 ? '' : 's'} accepted.</b>{' '}
          Guide content is compiled into the app, so accepting queues an edit
          rather than publishing one. Run <code>npm run review:export</code> to
          turn the accepted set into a patch for <code>src/data/</code>, then
          deploy.
        </p>
      )}
    </div>
  );
}
