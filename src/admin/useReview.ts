import { useCallback, useEffect, useMemo, useState } from 'react';
import ITEMS from './data/review-items.json';
import type { ReviewDecision, ReviewItem, ReviewRow, ReviewStatus } from './review-types';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

/**
 * The review queue: bundled proposals joined to stored decisions.
 *
 * Proposals ship with the console (version-controlled, diffable, no seeding
 * step). Decisions live in Supabase so a day's work survives a refresh and
 * follows the owner between machines.
 *
 * A decision is written the moment it is made rather than behind a Save
 * button. Working a backlog means dozens of small judgements, and a session
 * lost to a closed tab is the fastest way to stop trusting a tool like this.
 */

const ALL = ITEMS as ReviewItem[];

export interface ReviewState {
  rows: ReviewRow[];
  loading: boolean;
  /** Null while fine; a message when decisions could not be loaded or saved. */
  error: string | null;
  decide: (id: string, patch: Partial<Omit<ReviewDecision, 'item_id'>>) => Promise<void>;
  counts: Record<ReviewStatus, number> & { total: number; urgent: number };
}

const EMPTY = {
  status: 'pending' as ReviewStatus,
  final_text: null,
  note: null,
  decided_at: null,
  published_at: null,
};

export function useReview(): ReviewState {
  const [decisions, setDecisions] = useState<Record<string, Partial<ReviewDecision>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isSupabaseConfigured()) {
        setError('Supabase is not configured, so decisions cannot be saved.');
        setLoading(false);
        return;
      }
      const cp = getSupabaseClient();
      if (!cp) return;
      const supabase = await cp;
      const { data, error: e } = await supabase.from('review_decisions').select('*');
      if (cancelled) return;
      if (e) setError(e.message);
      else {
        const map: Record<string, Partial<ReviewDecision>> = {};
        for (const d of data ?? []) map[(d as ReviewDecision).item_id] = d as ReviewDecision;
        setDecisions(map);
      }
      setLoading(false);
    })().catch((e: unknown) => {
      if (!cancelled) {
        setError(e instanceof Error ? e.message : 'Could not load decisions.');
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const decide = useCallback(
    async (id: string, patch: Partial<Omit<ReviewDecision, 'item_id'>>) => {
      const next = {
        ...EMPTY,
        ...decisions[id],
        ...patch,
        item_id: id,
        decided_at: new Date().toISOString(),
      };
      // Optimistic: the click should feel instant. A failed write surfaces as
      // an error banner rather than silently reverting under the cursor.
      setDecisions((d) => ({ ...d, [id]: next }));
      const cp = getSupabaseClient();
      if (!cp) return;
      const supabase = await cp;
      const { error: e } = await supabase
        .from('review_decisions')
        .upsert(next, { onConflict: 'item_id' });
      if (e) setError(`Not saved: ${e.message}`);
      else setError(null);
    },
    [decisions],
  );

  const rows = useMemo<ReviewRow[]>(
    () =>
      ALL.map((item) => ({ ...item, ...EMPTY, ...decisions[item.id] }))
        // Corrections first — those are places the guide is currently wrong.
        // Then unreviewed work, then everything already decided.
        .sort((a, b) => {
          const rank = (r: ReviewRow) =>
            (r.urgent && r.status === 'pending' ? 0 : r.status === 'pending' ? 1 : 2);
          return rank(a) - rank(b) || a.target.localeCompare(b.target);
        }),
    [decisions],
  );

  const counts = useMemo(() => {
    const c = {
      pending: 0, accepted: 0, rewritten: 0, skipped: 0, needs_info: 0,
      total: rows.length, urgent: 0,
    };
    for (const r of rows) {
      c[r.status] += 1;
      if (r.urgent && r.status === 'pending') c.urgent += 1;
    }
    return c;
  }, [rows]);

  return { rows, loading, error, decide, counts };
}
