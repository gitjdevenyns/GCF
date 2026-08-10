import { useState } from 'react';
import type { MediaRef } from '../../data';

/**
 * Full-bleed photo for a hero band (`.lochero`, `.plate-hero`).
 *
 * Many guide images are hotlinked from third-party hosts that may block
 * embedding or disappear (KNOWN_ISSUES.md #2), so a hero image failing is an
 * expected state, not an exception. When it fails we render nothing and the
 * hero's gradient — which is a designed surface in its own right — carries the
 * band, exactly as it does for the spots that have no photo at all.
 *
 * The failure is tracked in state rather than by setting `style.display` on the
 * node: a direct DOM mutation is invisible to React and gets discarded on the
 * next re-render, which would flash a broken image back onto the screen.
 */
export function HeroImage({ media }: { media?: MediaRef | null }) {
  const [failed, setFailed] = useState(false);
  if (!media?.url || failed) return null;

  return (
    <img
      src={media.url}
      alt={media.alt}
      loading="eager"
      // The hero is the largest paint on the page; decoding off the main thread
      // keeps it from delaying the rest of the content.
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export default HeroImage;
