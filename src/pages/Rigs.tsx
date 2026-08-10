import { Link } from 'react-router-dom';
import { getRigs, getVideos } from '../lib/api';
import { Callout, SectionTitle } from '../components/ui';
import { ExternalRow } from '../components/ui/LinkRow';

/**
 * Rigs + Knots.
 *
 * Each rig carries a text schematic that reads left-to-right from the reel to
 * the bait, so it is rendered monospaced and given its own horizontal scroll
 * container — a wrapped schematic reads as two rigs, and the page body must
 * never scroll sideways at 390px.
 */
export default function Rigs() {
  const rigs = getRigs();
  const videos = getVideos();

  return (
    <>
      <div className="sect">
        <div className="lab lab-blue">Rig + knot school</div>
        <h1 style={{ margin: '4px 0 8px' }}>{rigs.length} rigs cover this coast</h1>
        <p className="mut">
          Read each schematic from the reel outward. Pick the one that puts the bait where the fish
          is with the least hardware in between.
        </p>
      </div>

      <section className="sect" aria-labelledby="rigs-h">
        <SectionTitle id="rigs-h">Rigs</SectionTitle>
        <div className="stack g3 cols-2">
          {rigs.map((r) => (
            <article className="card card-pad rigcard" key={r.id}>
              <h3>{r.name}</h3>
              {/* The ━ separators read as noise in a screen reader, so the visible
                  run is hidden from the a11y tree and spelled out as "A, then B"
                  alongside it. */}
              <div className="schematic" aria-hidden="true">
                <span className="mono">{r.schematic}</span>
              </div>
              <span className="vh">
                Rig order:{' '}
                {r.schematic
                  .split('━')
                  .map((part) => part.trim())
                  .filter(Boolean)
                  .join(', then ')}
                .
              </span>
              <p className="mut" style={{ fontSize: 'var(--fs-sm)' }}>
                {r.use}
              </p>
            </article>
          ))}
        </div>
        <p className="mut xs mt3">
          Schematics scroll sideways on a narrow screen — the order of the components is the point.
        </p>
      </section>

      <section className="sect" aria-labelledby="video-h">
        <SectionTitle id="video-h">Knots &amp; rigs on video</SectionTitle>
        <p className="mut" style={{ marginBottom: 'var(--s3)' }}>
          These leave the app and open on YouTube.
        </p>
        <div className="card">
          {videos.map((v) => (
            <ExternalRow key={v.url} href={v.url} glyph="▶" title={v.title} note="YouTube" />
          ))}
        </div>
      </section>

      <section className="sect" aria-labelledby="rig-next-h" style={{ paddingBottom: 'var(--s7)' }}>
        <SectionTitle id="rig-next-h">What to tie it to</SectionTitle>
        <Callout tone="info" title="Leader and hook sizes are per species">
          The rig is only half the answer. Each species page carries the rod, reel, main line, leader
          and hook size that goes with it.
        </Callout>
        <div className="row wrap g2 mt3">
          <Link className="btn btn-blue" to="/fish">
            Target species
          </Link>
          <Link className="btn btn-ghost" to="/water">
            Read the water
          </Link>
        </div>
      </section>
    </>
  );
}
