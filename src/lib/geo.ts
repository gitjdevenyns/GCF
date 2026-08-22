import { useCallback, useEffect, useState } from 'react';

/**
 * Device location, asked for once and never assumed.
 *
 * Two rules this module exists to keep:
 *
 *  1. NEVER PROMPT UNINVITED. `request()` has to be called from a real user
 *     gesture. A permission sheet that appears on page load gets dismissed on
 *     reflex, and a dismissed prompt is sticky — one uninvited ask can cost
 *     the feature for good. It also happens to be the only reliable way to get
 *     the prompt on iOS Safari.
 *
 *  2. THE COORDINATES NEVER LEAVE THE DEVICE. Ranking nearby spots is
 *     arithmetic against 25 bundled locations, so it runs offline, on-device,
 *     and there is no request anywhere in this feature carrying a position.
 *     That is a deliberate design property, not an implementation detail —
 *     the same posture as the photo identifier, which never stores a photo.
 *     Do not add a network call that takes `coords`.
 */

export interface Coords {
  lat: number;
  lng: number;
  /** Accuracy radius in metres, as reported by the device. */
  accuracy_m: number | null;
}

export type GeoStatus =
  /** Not asked yet. The UI shows the invitation, not a prompt. */
  | 'idle'
  /** Prompt is open, or a fix is in flight. */
  | 'asking'
  | 'granted'
  /** Refused, or previously refused. Never re-prompt on your own. */
  | 'denied'
  /** No geolocation here: old browser, or a non-secure origin. */
  | 'unsupported'
  /** Permission held but no fix (indoors, timeout, hardware). Retryable. */
  | 'error';

export interface GeoResult {
  status: GeoStatus;
  coords: Coords | null;
  error: string | null;
  request: () => void;
  clear: () => void;
}

const isSupported = () =>
  typeof navigator !== 'undefined' && typeof navigator.geolocation !== 'undefined';

export function useGeolocation(): GeoResult {
  const [status, setStatus] = useState<GeoStatus>(() =>
    isSupported() ? 'idle' : 'unsupported',
  );
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);

  // If the browser already remembers a refusal, reflect it instead of offering
  // to ask again. Permissions is not everywhere; a missing one just leaves us
  // idle and lets the user decide — never a prompt.
  useEffect(() => {
    if (!isSupported() || typeof navigator.permissions?.query !== 'function') return;
    let cancelled = false;
    navigator.permissions
      .query({ name: 'geolocation' as PermissionName })
      .then((p) => {
        if (!cancelled && p.state === 'denied') setStatus('denied');
      })
      .catch(() => {
        /* Unsupported descriptor. Stay idle. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const request = useCallback(() => {
    if (!isSupported()) {
      setStatus('unsupported');
      return;
    }
    setStatus('asking');
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy_m: Number.isFinite(pos.coords.accuracy) ? pos.coords.accuracy : null,
        });
        setStatus('granted');
      },
      (err) => {
        // Refusal and failure are different outcomes and must not be merged:
        // one means stop asking, the other means offer a retry.
        if (err.code === err.PERMISSION_DENIED) {
          setStatus('denied');
          setError(null);
          return;
        }
        setStatus('error');
        setError(
          err.code === err.TIMEOUT
            ? 'Timed out looking for a fix.'
            : 'Could not get a position.',
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  const clear = useCallback(() => {
    setCoords(null);
    setStatus(isSupported() ? 'idle' : 'unsupported');
    setError(null);
  }, []);

  return { status, coords, error, request, clear };
}

const R_MILES = 3958.8;
const rad = (d: number) => (d * Math.PI) / 180;

/** Great-circle distance in statute miles. */
export function milesBetween(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R_MILES * Math.asin(Math.min(1, Math.sqrt(s)));
}
