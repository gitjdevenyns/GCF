import { useCallback, useEffect, useState } from 'react';
import type { ConditionsResult, ConditionsSnapshot } from './conditions';
import { freshnessOf } from './conditions';
import { fetchConditions } from './api';
import { isSupabaseConfigured } from './supabase';

/**
 * Live conditions for one location slug.
 *
 * Contract (see conditions.ts): never throws, never leaves an unhandled
 * rejection, always resolves into one of the four statuses. Consumers render
 * skeletons on 'loading', the inline ErrorState on 'error', and simply omit the
 * live slots on 'unavailable'.
 */
export function useConditions(slug: string | null | undefined): ConditionsResult {
  const [state, setState] = useState<{
    status: ConditionsResult['status'];
    data: ConditionsSnapshot | null;
    error: string | null;
  }>(() => ({
    status: !slug || !isSupabaseConfigured() ? 'unavailable' : 'loading',
    data: null,
    error: null,
  }));
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!slug || !isSupabaseConfigured()) {
      setState({ status: 'unavailable', data: null, error: null });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, status: s.data ? s.status : 'loading', error: null }));

    fetchConditions(slug)
      .then((data) => {
        if (cancelled) return;
        setState({ status: 'ready', data, error: null });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : 'Unknown error';
        // Keep any previously good data on screen rather than blanking the card.
        setState((s) => ({ status: 'error', data: s.data, error: message }));
      });

    return () => {
      cancelled = true;
    };
  }, [slug, nonce]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
  const freshness =
    state.status === 'unavailable'
      ? 'unavailable'
      : state.status === 'error'
        ? offline
          ? 'offline'
          : state.data
            ? freshnessOf(state.data.refreshed_at)
            : 'unavailable'
        : freshnessOf(state.data?.refreshed_at);

  return { status: state.status, data: state.data, freshness, error: state.error, refetch };
}
