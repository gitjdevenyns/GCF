/**
 * Line icons lifted from the design boards (24px grid, 1.9 stroke, currentColor).
 * All are decorative — every icon is paired with a visible text label, so they
 * are hidden from assistive tech.
 */
type IconProps = { className?: string };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

export function IconHome({ className = 'ic' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 11 L12 4 L20 11" />
      <path d="M6 11 V20 H18 V11" />
    </svg>
  );
}

export function IconSpots({ className = 'ic' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21 C 12 21 5 14.5 5 10 a7 7 0 0 1 14 0 c0 4.5 -7 11 -7 11 Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

export function IconWater({ className = 'ic' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 9 q 4.5 -4 9 0 t 9 0" />
      <path d="M3 15 q 4.5 -4 9 0 t 9 0" />
    </svg>
  );
}

export function IconFish({ className = 'ic' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 12 q 6 -7 13 0 q -7 7 -13 0 Z" />
      <path d="M16 12 l5 -4 v8 Z" />
    </svg>
  );
}

export function IconCare({ className = 'ic' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 4 L21 19 H3 Z" />
      <path d="M12 10 v4" />
      <circle cx="12" cy="16.6" r=".6" fill="currentColor" />
    </svg>
  );
}

export function IconWind({ className = 'ic2-svg' }: IconProps) {
  return (
    <svg {...base} className={className} width="18" height="18">
      <path d="M3 8h11a3 3 0 1 0-3-3" />
      <path d="M3 12h15a3 3 0 1 1-3 3" />
      <path d="M3 16h8" />
    </svg>
  );
}

export function IconMoon({ className = 'ic2-svg' }: IconProps) {
  return (
    <svg {...base} className={className} width="18" height="18">
      <path d="M20 13.5A8 8 0 0 1 10.5 4 7.5 7.5 0 1 0 20 13.5Z" />
    </svg>
  );
}

export function IconTemp({ className = 'ic2-svg' }: IconProps) {
  return (
    <svg {...base} className={className} width="18" height="18">
      <path d="M12 14V5a2 2 0 0 0-4 0v9a4 4 0 1 0 4 0Z" />
    </svg>
  );
}

export function IconClarity({ className = 'ic2-svg' }: IconProps) {
  return (
    <svg {...base} className={className} width="18" height="18">
      <path d="M12 3s6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 6-10 6-10Z" />
    </svg>
  );
}
