import { Link } from 'react-router-dom';
import { getFishList, getHabitats } from '../lib/api';
import { Callout, Plate, SectionTitle } from '../components/ui';
import { MediaCredit } from '../components/ui/MediaCredit';
import { habitatChips, habitatModuleFor } from '../components/species/speciesContent';
import { IconFish, IconSpots, IconWater } from '../components/ui/icons';

const base = import.meta.env.BASE_URL;

/**
 * Read the Water — the habitat modules.
 *
 * "Show before explaining" (PRODUCT_SPEC §1): every module leads with the
 * annotated diagram, then real photographs, and only then the three questions
 * an angler actually has — what does it look like, what is in it, how do I
 * fish it. Photo counts vary per habitat, so the layout never assumes two.
 */
export default function Water() {
  const habitats = getHabitats();
  const fish = getFishList();

  /** Species whose own `habitat` field names this module — a real link, not a guess. */
  const speciesFor = (habitatId: string) =>
    fish.filter((f) =>
      habitatChips(f.habitat).some((c) => habitatModuleFor(c) === habitatId),
    );

  return (
    <>
      <div className="sect">
        <div className="lab lab-blue">Read the water</div>
        <h1 style={{ margin: '4px 0 8px' }}>Productive water has a look</h1>
        <p className="mut">
          A handful of things on this coast hold fish, and every one of them announces itself if you
          know the shape. Diagram first, then the real thing, then what to do about it.
        </p>
      </div>

      <div className="sect">
        <Callout tone="info" title="Learn the shape, not the spot">
          These modules are what productive water looks like anywhere on this coast. A specific place
          — tide, access, targets — lives on its{' '}
          <Link to="/locations">location page</Link>.
        </Callout>
      </div>

      {habitats.map((h) => {
        const species = speciesFor(h.id);
        return (
          <section className="sect" key={h.id} id={`hab-${h.id}`} aria-labelledby={`hab-${h.id}-h`}>
            <SectionTitle id={`hab-${h.id}-h`}>{h.name}</SectionTitle>

            <figure className="diagram-fig">
              <div className="diagram">
                <img src={base + h.diagram} alt={`Annotated diagram — ${h.name}`} />
              </div>
              <figcaption className="mut xs">
                Annotated diagram — the labels mark the productive edge.
              </figcaption>
            </figure>

            {h.photos.length > 0 && (
              <div className="stack g3 cols-2 mt3">
                {h.photos.map((p) => (
                  <div key={p.url}>
                    <Plate media={p} caption="real example" className="plate-tall" />
                    <MediaCredit media={p} />
                  </div>
                ))}
              </div>
            )}

            <div className="mods mods--3 mt4">
              <div className="mod">
                <span className="ic2" aria-hidden="true">
                  <IconWater />
                </span>
                <div>
                  <b>What it looks like</b>
                  <div className="t">{h.look}</div>
                </div>
              </div>
              <div className="mod">
                <span className="ic2" aria-hidden="true">
                  <IconFish />
                </span>
                <div>
                  <b>What is likely in it</b>
                  <div className="t">{h.fish}</div>
                </div>
              </div>
              <div className="mod">
                <span className="ic2" aria-hidden="true">
                  <IconSpots />
                </span>
                <div>
                  <b>How to fish it</b>
                  <div className="t">{h.how}</div>
                </div>
              </div>
            </div>

            {species.length > 0 && (
              <div className="row wrap g2 mt3">
                <span className="lab">Guide species here</span>
                {species.map((f) => (
                  <Link key={f.id} className="chip chip-ghost-blue chip-tap" to={`/fish/${f.id}`}>
                    {f.name}
                  </Link>
                ))}
              </div>
            )}
          </section>
        );
      })}

      <section className="sect" aria-labelledby="water-next-h" style={{ paddingBottom: 'var(--s7)' }}>
        <SectionTitle id="water-next-h">Next</SectionTitle>
        <div className="row wrap g2">
          <Link className="btn btn-blue" to="/locations">
            Find this water near you
          </Link>
          <Link className="btn btn-ghost" to="/rigs">
            Rigs + knots
          </Link>
          <Link className="btn btn-ghost" to="/fish">
            Target species
          </Link>
        </div>
      </section>
    </>
  );
}
