import { Link } from 'react-router-dom';
import { fishById, rigById } from '../data';
import type { TargetRecipe as TargetRecipeType } from '../data';
import { Callout } from './ui';
import type { Zone } from './location/zones';

/**
 * Species playbook card (design board 02): header (probability + where the
 * fish positions) → cast instruction keyed to a numbered zone → recipe grid →
 * landing and release. One component for all 25 locations; only the data
 * changes.
 *
 * Every value is real: the rig/hook/leader/weight/bait come from the
 * location's own target record, the rod/reel/line, landing tool and handling
 * notes come from the species guide entry. Fields the data does not have are
 * left out rather than filled with a plausible-looking guess.
 */

/**
 * The v6 data records target order, and documents that position 1 is the
 * primary target. It does not record a probability for the rest, so they are
 * labelled neutrally rather than given a confidence nobody measured.
 */
const PRIORITY_LABEL = (priority: number) =>
  priority === 1 ? 'Primary target here' : 'Also targeted here';

export default function TargetRecipe({
  target,
  zone,
}: {
  target: TargetRecipeType;
  /** The numbered casting zone this species is most likely to be working. */
  zone?: Zone | null;
}) {
  const fish = target.species_id ? fishById(target.species_id) : undefined;
  const rig = target.rig_id ? rigById(target.rig_id) : undefined;
  const photo = fish?.images[0];

  const cells: Array<[string, string]> = [
    ['Rig', target.rig],
    ['Hook', target.hook],
    ['Leader', target.leader],
    ['Weight', target.weight],
    ['Bait / lure', target.bait],
  ];
  if (target.main_line) cells.push(['Main line', target.main_line]);
  if (fish?.gear) cells.push(['Rod / reel / line', fish.gear]);
  if (target.presentation) cells.push(['Retrieve', target.presentation]);

  return (
    <article className="play">
      <div className="play-hd">
        <div className="av">
          {photo && <img src={photo.url} alt={photo.alt} loading="lazy" />}
        </div>
        <div>
          <p className={`pri${target.priority > 1 ? ' med' : ''}`}>
            <i aria-hidden="true" />
            {PRIORITY_LABEL(target.priority)}
          </p>
          <h3>
            {fish ? (
              <Link to={`/fish/${fish.id}`}>{target.species_label}</Link>
            ) : (
              target.species_label
            )}
          </h3>
          {fish ? (
            <p className="mut xs">Holds around {fish.habitat.toLowerCase()}.</p>
          ) : (
            <p className="mut xs">No species page in the guide yet — tackle only.</p>
          )}
        </div>
      </div>

      <div className="play-b">
        {zone && (
          <p className="cast">
            <span className="pin">{zone.n}</span>
            <span>
              <b>{zone.title}.</b> {zone.cast}
            </span>
          </p>
        )}

        <div className="recipe">
          {cells.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <b>{value}</b>
            </div>
          ))}
        </div>

        {rig && (
          <p className="kvrow">
            <span className="k">Schematic</span>
            <span className="v">
              <Link to="/rigs">{rig.name}</Link>
              <br />
              <span className="mono">{rig.schematic}</span>
            </span>
          </p>
        )}

        {fish && (
          <>
            <p className="kvrow">
              <span className="k">Landing</span>
              <span className="v">{fish.landing_tool}</span>
            </p>
            <p className="kvrow">
              <span className="k">Release</span>
              <span className="v">
                {fish.handling.dos.slice(0, 2).join(' · ')} —{' '}
                <Link to={`/fish/${fish.id}`}>full handling guide</Link>
              </span>
            </p>
            <Callout tone="warn" title="Angler hazard" className="play-hazard">
              {fish.handling.angler}
            </Callout>
          </>
        )}
      </div>
    </article>
  );
}
