import type { Hazard } from '../../data';
import { Plate } from '../ui';
import { MediaCredit } from '../ui/MediaCredit';
import { hazardContent } from './hazardContent';

/**
 * One Handle With Care species.
 *
 * Every card runs identification → risk → handling, in that order. An angler
 * who cannot name the animal cannot act on the handling note, so identification
 * always comes first — and the hazard type is a labelled chip so the category
 * never depends on colour alone.
 *
 * `risk` and `handle` are rendered verbatim from the data record.
 */
export function HazardCard({ hazard }: { hazard: Hazard }) {
  const content = hazardContent(hazard.id);
  const headingId = `haz-${hazard.id}`;

  return (
    <article className="haz" id={headingId} aria-labelledby={`${headingId}-h`}>
      <div className="haz-hd">
        <div>
          {content && <span className={`hazkind ${content.kind}`}>{content.kindLabel}</span>}
          <h3 id={`${headingId}-h`}>{hazard.name}</h3>
          {content && <div className="mut xs">{content.framing}</div>}
        </div>
      </div>

      <div className="haz-b">
        <div className="blk">
          <div className="rl">How to know it</div>
          {/* A full identification plate rather than a thumbnail: these photos were
              chosen for the features they show, and 64px cannot carry that. */}
          <Plate
            media={hazard.image}
            caption="identification photo"
            className="plate-tall"
          />
          <MediaCredit media={hazard.image} />
          {content ? (
            <div className="bd mt2">{content.identify}</div>
          ) : (
            <div className="bd mt2 mut">
              Identification notes for this species are not documented yet — use the photograph and
              treat it as unidentified.
            </div>
          )}
        </div>

        <div className="blk">
          <div className="rl">The risk</div>
          <div className="bd">{hazard.risk}</div>
        </div>

        <div className="blk">
          <div className="rl">How to handle it</div>
          <div className="bd">{hazard.handle}</div>
        </div>
      </div>
    </article>
  );
}

export default HazardCard;
