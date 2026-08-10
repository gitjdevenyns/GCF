import { Link, useParams } from 'react-router-dom';
import { getFish, getHabitats, getLocations, getVideos } from '../lib/api';
import { sourceById } from '../data';
import { Callout, IdPlate, SectionTitle } from '../components/ui';
import HeroImage from '../components/ui/HeroImage';
import { ExternalRow, LinkRow } from '../components/ui/LinkRow';
import { MediaCredit } from '../components/ui/MediaCredit';
import {
  habitatChips,
  habitatModuleFor,
  parseBaits,
  parseGear,
  speciesContent,
} from '../components/species/speciesContent';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Species page — one template for all five targets.
 *
 * Order is deliberate and matches design board 03: identification first, then
 * where it lives, then tackle, then handling. An angler who cannot name the
 * fish should not be reading the release note for a different one.
 */
export default function FishDetail() {
  const { id } = useParams();
  const fish = id ? getFish(id) : undefined;

  if (!fish) {
    return (
      <div className="sect">
        <h1>Species not found</h1>
        <p className="mut" style={{ margin: 'var(--s3) 0 var(--s4)' }}>
          There is no guide entry for “{id}”. The guide currently covers five target species.
        </p>
        <p>
          <Link className="btn btn-blue" to="/fish">
            All species
          </Link>
        </p>
      </div>
    );
  }

  const content = speciesContent(fish.id);
  const gear = parseGear(fish.gear);
  const baits = parseBaits(fish.bait);
  const chips = habitatChips(fish.habitat);
  const habitats = getHabitats();
  const hero = fish.images[1] ?? fish.images[0];

  const where = getLocations().filter((l) =>
    l.targets.some((t) => t.species_id === fish.id),
  );
  const knots = getVideos().filter((v) => /knot/i.test(v.title));

  const fwc = sourceById('fwc-saltwater');
  const museum = sourceById('florida-museum');

  return (
    <>
      <div className="pad" style={{ paddingTop: 'var(--s3)' }}>
        <Link className="backlink" to="/fish">
          <span aria-hidden="true">‹</span> All species
        </Link>
      </div>

      <div className="lochero">
        <HeroImage media={hero} />
        <div className="inner">
          {content && content.tags.length > 0 && (
            <div className="row g2 wrap" style={{ marginBottom: 8 }}>
              {content.tags.map((t, i) => (
                <span key={t} className={i === 0 ? 'chip chip-lime' : 'chip chip-on-dark'}>
                  {t}
                </span>
              ))}
            </div>
          )}
          <h1 className="d2">{fish.name}</h1>
          <p className="mono" style={{ color: '#c5dcff', marginTop: 6 }}>
            {fish.habitat}
          </p>
        </div>
      </div>

      {/* The hero is a second, wider photograph where one exists. When it is a
          licensed image it needs its credit on screen just like the ID plate
          does — src/test/media.test.tsx enforces exactly this. */}
      {hero && hero !== fish.images[0] && (
        <div className="pad" style={{ paddingTop: 'var(--s2)' }}>
          <MediaCredit media={hero} />
        </div>
      )}

      {content && (
        <div className="sect">
          <p style={{ fontSize: 16, lineHeight: 1.5 }}>{content.lede}</p>
        </div>
      )}

      {/* ---------------------------------------------------- identification */}
      <section className="sect" aria-labelledby="id-h">
        <SectionTitle id="id-h">Know it on sight</SectionTitle>
        {content && (
          <p className="mut" style={{ marginBottom: 'var(--s3)' }}>
            {content.idLede}
          </p>
        )}
        {/* From 900px the plate and its mark list sit side by side (design board 03). */}
        <div className="idsplit">
          <div>
            <IdPlate
              media={fish.images[0] ?? null}
              caption="identification photo · lateral profile"
              marks={content?.marks ?? []}
            />
            <p className="mono" style={{ color: 'var(--m)', marginTop: 8 }}>
              marks are placed for a lateral profile facing left · re-check them against the
              licensed photo
            </p>
            <MediaCredit media={fish.images[0]} />
          </div>
          {content && content.marks.length > 0 ? (
          <ul className="zonelist">
            {content.marks.map((m) => (
              <li key={m.n}>
                <span className="pin" aria-hidden="true">
                  {m.n}
                </span>
                <span>
                  <b>{m.title}.</b>{' '}
                  <span
                    className={m.weight === 'decisive' ? 'chip chip-lime markweight' : 'chip markweight'}
                  >
                    {m.weight === 'decisive' ? 'Settles it' : 'Supporting'}
                  </span>{' '}
                  {m.body}
                </span>
              </li>
            ))}
          </ul>
          ) : (
            <p className="mut xs" style={{ marginTop: 'var(--s3)' }}>
              Identification marks for this species are not documented yet.
            </p>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------- confusables */}
      {content && content.confusables.length > 0 && (
        <section className="sect" aria-labelledby="conf-h">
          <SectionTitle id="conf-h">Not to be confused with</SectionTitle>
          <div className="card card-pad">
            {content.confusables.map((c) => (
              <div className="tell" key={c.name}>
                <span className="q" aria-hidden="true">
                  ?
                </span>
                <span>
                  <b>{c.name}</b> — {c.tell}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ----------------------------------------------------- where it lives */}
      <section className="sect" aria-labelledby="where-h">
        <SectionTitle id="where-h">Where it lives</SectionTitle>
        <div className="row wrap g2" style={{ marginBottom: 'var(--s3)' }}>
          {chips.map((c) => {
            const mod = habitatModuleFor(c);
            return mod ? (
              <Link key={c} className="chip chip-ghost-blue chip-tap" to={`/water#hab-${mod}`}>
                {cap(c)}
              </Link>
            ) : (
              <span key={c} className="chip">
                {cap(c)}
              </span>
            );
          })}
        </div>

        <div className="card">
          {habitats
            .filter((h) => chips.some((c) => habitatModuleFor(c) === h.id))
            .map((h) => (
              <LinkRow
                key={h.id}
                to={`/water#hab-${h.id}`}
                glyph="⤳"
                title={h.name}
                note={h.how}
              />
            ))}
          <LinkRow
            to="/water"
            glyph="≡"
            title="Read the water"
            note="Learn what each of these looks like before you get there."
          />
        </div>
      </section>

      {/* ------------------------------------------------------------ tackle */}
      <section className="sect" aria-labelledby="tackle-h">
        <SectionTitle id="tackle-h">Tackle</SectionTitle>
        <div className="card card-pad">
          <dl className="spec">
            {gear.raw ? (
              <>
                <dt>Gear</dt>
                <dd>{gear.raw}</dd>
              </>
            ) : (
              <>
                <dt>Rod</dt>
                <dd>{gear.rod}</dd>
                <dt>Reel</dt>
                <dd>{gear.reel}</dd>
                <dt>Main line</dt>
                <dd>{gear.line}</dd>
              </>
            )}
            <dt>Leader</dt>
            <dd>{fish.leader}</dd>
            <dt>Hook</dt>
            <dd>{fish.hook}</dd>
            <dt>Landing</dt>
            <dd>{fish.landing_tool}</dd>
          </dl>
        </div>

        <Callout tone="info" title="These are starting points" className="mt3">
          Tackle sizes and habitat notes are local tactics, not regulation. Seasons, size and bag
          limits and permit requirements change and are decided by{' '}
          {fwc ? (
            <a href={fwc.url} target="_blank" rel="noreferrer">
              FWC<span aria-hidden="true"> ↗</span>
              <span className="vh">(opens in a new tab)</span>
            </a>
          ) : (
            'FWC'
          )}
          . Check there before you keep anything.
        </Callout>

        <p className="mt3">
          <Link className="btn btn-ghost" to="/rigs">
            Rigs + knots for this tackle
          </Link>
        </p>
      </section>

      {/* -------------------------------------------------------------- bait */}
      {baits.length > 0 && (
        <section className="sect" aria-labelledby="bait-h">
          <SectionTitle id="bait-h">Bait &amp; lures</SectionTitle>
          <div className="baits">
            {baits.map((b) => (
              <div className="bait" key={`${b.kind}-${b.name}`}>
                <div className="swatch" aria-hidden="true" />
                <b>{cap(b.name)}</b>
                <div className="when">
                  {b.kind === 'natural' ? 'Live or natural bait' : 'Artificial'}
                </div>
              </div>
            ))}
          </div>
          <p className="mut xs" style={{ marginTop: 'var(--s3)' }}>
            Match what is already in the water in front of you before reaching for anything clever.
          </p>
        </section>
      )}

      {/* ---------------------------------------------------------- handling */}
      <section className="sect handling-box" aria-labelledby="handling-h">
        <SectionTitle id="handling-h">Handling &amp; release</SectionTitle>
        <p className="mut" style={{ marginBottom: 'var(--s3)' }}>
          Release it alive and in shape to swim away — everything below assumes the fish is going
          back.
        </p>

        <Callout tone="warn" title="Angler hazard" className="mb3">
          {fish.handling.angler}
        </Callout>

        <div className="dd">
          <div className="dd-col dd-do">
            <h3>Do</h3>
            <ul>
              {fish.handling.dos.map((d) => (
                <li key={d}>
                  <span className="tick" aria-hidden="true">
                    ✓
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="dd-col dd-dont">
            <h3>Don&rsquo;t</h3>
            <ul>
              {fish.handling.donts.map((d) => (
                <li key={d}>
                  <span className="cross" aria-hidden="true">
                    ✕
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt3">
          <Link className="btn btn-ghost" to="/care">
            Handle With Care — hazard species
          </Link>
        </p>
      </section>

      {/* ------------------------------------------------------- where to go */}
      {where.length > 0 && (
        <section className="sect" aria-labelledby="spots-h">
          <SectionTitle id="spots-h">Where to catch one</SectionTitle>
          <div className="card">
            {where.map((l) => (
              <LinkRow
                key={l.id}
                to={`/locations/${l.slug}`}
                glyph="⚑"
                title={l.name}
                note={l.region}
              />
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- knots */}
      {knots.length > 0 && (
        <section className="sect" aria-labelledby="knots-h">
          <SectionTitle id="knots-h" to="/rigs" linkLabel="All rigs">
            Knots
          </SectionTitle>
          <div className="card">
            {knots.map((v) => (
              <ExternalRow key={v.url} href={v.url} glyph="▶" title={v.title} note="Video" />
            ))}
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------- sources */}
      <section className="sect" aria-labelledby="src-h" style={{ paddingBottom: 'var(--s7)' }}>
        <SectionTitle id="src-h">Sources</SectionTitle>
        <p className="srcs">
          Seasons, size and bag limits, permits and fish-handling guidance:{' '}
          {fwc ? (
            <a href={fwc.url} target="_blank" rel="noreferrer">
              {fwc.label}
              <span aria-hidden="true"> ↗</span>
            </a>
          ) : (
            'FWC'
          )}
          . Species profile and identification:{' '}
          {museum ? (
            <a href={museum.url} target="_blank" rel="noreferrer">
              {museum.label}
              <span aria-hidden="true"> ↗</span>
            </a>
          ) : (
            'Florida Museum'
          )}
          . Tackle sizes are starting points, not rules — structure and current can call for heavier
          gear. External links open in a new tab.
        </p>
      </section>
    </>
  );
}
