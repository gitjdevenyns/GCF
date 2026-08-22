import type { ReactNode } from 'react';
import { useEntitlements } from '../lib/useEntitlements';
import { SPONSOR_LABEL } from '../lib/listings';

/**
 * The only way an advertisement reaches the screen.
 *
 * Two properties are structural rather than a matter of discipline at the call
 * site, because both are the sort of thing that gets forgotten exactly once and
 * then matters a great deal:
 *
 *  1. **It renders nothing unless `ads.enabled` is on for this reader's tier.**
 *     Paid readers are paying for its absence, so the check lives here and not
 *     in whichever screen happens to host a slot.
 *
 *  2. **It always draws the disclosure.** There is no prop to suppress it and
 *     no path through this component that omits it. Undisclosed paid placement
 *     is deceptive advertising, and this guide's credibility is the product it
 *     sells — a labelled ad costs a little attention, an unlabelled one costs
 *     the reason anyone trusts the guide.
 */
export default function AdSlot({
  children,
  label = SPONSOR_LABEL,
}: {
  /** The advertiser's creative. Null renders nothing — never a placeholder. */
  children: ReactNode;
  label?: string;
}) {
  const { can } = useEntitlements();
  if (!can('ads.enabled')) return null;
  if (!children) return null;

  return (
    <aside className="adslot" aria-label={label}>
      <span className="adslot-tag">{label}</span>
      <div className="adslot-body">{children}</div>
    </aside>
  );
}
