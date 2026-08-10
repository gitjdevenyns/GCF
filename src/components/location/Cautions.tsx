import { Link } from 'react-router-dom';
import type { Location } from '../../data';
import { Callout } from '../ui';
import type { Zone, ZoneKind } from './zones';

/**
 * "Before you go" for a location.
 *
 * Every one of the fifteen locations currently ships with an empty `safety`
 * array — no location-specific caveat has been researched yet. Rather than
 * inventing "the bars here are live oyster", this section says that plainly
 * and then offers the cautions that follow from the structure and access types
 * the data does record, clearly labelled as general water-safety rules.
 */

interface Caution {
  id: string;
  tone: 'default' | 'warn';
  title: string;
  body: string;
}

const BY_KIND: Partial<Record<ZoneKind, Caution>> = {
  oyster: {
    id: 'shell',
    tone: 'warn',
    title: 'Shell cuts before anything else does',
    body: 'Oyster goes straight through sandals and bare feet. Hard-soled wading boots anywhere there is shell, and keep your line off the bar as well as your feet.',
  },
  pass: {
    id: 'current',
    tone: 'warn',
    title: 'A pass runs harder than it looks',
    body: 'Current through an inlet can move faster than you can wade or paddle against, and wind against tide stands the water up. Know the stage before you commit to a position.',
  },
  channel: {
    id: 'channel',
    tone: 'warn',
    title: 'Deep water and boat traffic',
    body: 'Channel edges drop off quickly and carry traffic. Cross them square and quickly in a kayak, and stay off the edge in low light.',
  },
  bridge: {
    id: 'bridge',
    tone: 'default',
    title: 'Bridges are shared water',
    body: 'Boats use the span day and night. Keep line, body and landing clear of the navigation channel, and expect wake against the pilings.',
  },
  lights: {
    id: 'night',
    tone: 'default',
    title: 'Fishing after dark',
    body: 'Light lines mean night sessions: a headlamp, a second person or a plan someone knows about, and extra care on wet, sloped structure.',
  },
  cut: {
    id: 'cut',
    tone: 'warn',
    title: 'Cuts pull seaward',
    body: 'Water funnelling through a gap in a bar is the classic rip. Do not wade a cut you cannot see the bottom of, and never try to swim straight back against one.',
  },
  surf: {
    id: 'shuffle',
    tone: 'warn',
    title: 'Shuffle, don’t step',
    body: 'Rays lie buried on sand in the trough and in potholes. Sliding your feet moves a ray; planting a foot on one gets you stung.',
  },
};

const WADE_CAUTION: Caution = {
  id: 'shuffle',
  tone: 'warn',
  title: 'Shuffle, don’t step',
  body: 'Rays lie buried on sand in the potholes and along the edges. Sliding your feet moves a ray; planting a foot on one gets you stung.',
};

const PADDLE_CAUTION: Caution = {
  id: 'paddle',
  tone: 'default',
  title: 'Small boat, big water',
  body: 'Wind, tide and traffic all matter more from a kayak. Check the forecast for the whole session, not the launch, and be visible in low light.',
};

const STORM_CAUTION: Caution = {
  id: 'storm',
  tone: 'default',
  title: 'Afternoon storms build fast',
  body: 'From roughly June to September, open flats, beaches and piers have no cover and the cell arrives quicker than the walk back. Watch the sky, not the bite.',
};

export default function Cautions({ loc, zones }: { loc: Location; zones: Zone[] }) {
  const kinds = new Set(zones.map((z) => z.kind));
  const cautions: Caution[] = [];
  const seen = new Set<string>();

  const push = (c: Caution | undefined) => {
    if (!c || seen.has(c.id)) return;
    seen.add(c.id);
    cautions.push(c);
  };

  for (const zone of zones) push(BY_KIND[zone.kind]);
  if (
    loc.access.includes('wade') ||
    kinds.has('potholes') ||
    kinds.has('grass') ||
    kinds.has('flat')
  )
    push(WADE_CAUTION);
  if (loc.access.includes('kayak') || loc.access.includes('boat')) push(PADDLE_CAUTION);
  push(STORM_CAUTION);

  return (
    <div className="stack g3">
      {loc.safety.length > 0 ? (
        loc.safety.map((s) => (
          <Callout key={s} tone="warn">
            {s}
          </Callout>
        ))
      ) : (
        <p className="mut">
          No caveats specific to this spot have been documented and checked yet. What follows
          are general rules for this kind of water and this kind of access — they are not a
          substitute for looking at the place when you get there.
        </p>
      )}

      {cautions.map((c) => (
        <Callout key={c.id} tone={c.tone} title={c.title}>
          {c.body}
        </Callout>
      ))}

      <Callout tone="warn" title="Know what you might catch">
        Catfish, stingrays, lionfish, barracuda, sharks and puffers all turn up on this coast.{' '}
        <Link to="/care">Handle With Care</Link> covers how to deal with each one.
      </Callout>
    </div>
  );
}
