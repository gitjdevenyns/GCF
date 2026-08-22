import { useEffect, useRef, useState } from 'react';

/**
 * Measured width of a layout slot, in CSS pixels.
 *
 * Charts in this app are drawn into a viewBox sized to the slot rather than a
 * fixed viewBox stretched to fit. The difference matters: a fixed viewBox
 * stretched with `preserveAspectRatio="none"` scales the two axes by different
 * factors, and text suffers worst — on a 900px-wide card a 320-unit chart
 * stretches every glyph 2.8x horizontally against 1x vertically, which reads
 * as smeared type. Measuring keeps one user unit equal to one CSS pixel, so
 * glyphs render at their true size and the extra width goes into the plot.
 *
 * jsdom has no ResizeObserver. The fallback keeps tests, and any environment
 * without one, rendering a correct (if narrow) chart rather than nothing.
 */
export function useSlotWidth(fallback: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      if (w > 0) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}
