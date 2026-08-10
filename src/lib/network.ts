import { useEffect, useState } from 'react';

/**
 * Live online/offline status.
 *
 * `navigator.onLine` only proves a network interface exists, not that anything
 * is reachable — so this is used to *explain* a failure the app already
 * detected, never to pre-emptively block a request. The app must always attempt
 * the fetch and handle its result.
 */
export function useOnline(): boolean {
  const [online, setOnline] = useState(
    () => typeof navigator === 'undefined' || navigator.onLine !== false,
  );

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  return online;
}
