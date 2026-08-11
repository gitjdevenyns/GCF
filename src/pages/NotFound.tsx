import { Link } from 'react-router-dom';
import { SectionTitle } from '../components/ui';
import { LinkRow } from '../components/ui/LinkRow';

const SECTIONS = [
  { to: '/', glyph: '⌂', title: 'Home', note: 'Conditions and what to do about them right now' },
  { to: '/locations', glyph: '⚑', title: 'Spots', note: 'Every fishing location in the guide' },
  { to: '/tides', glyph: '≈', title: 'Tides + water', note: 'How the stage changes a place' },
  { to: '/water', glyph: '≡', title: 'Read the water', note: 'What productive water looks like' },
  { to: '/fish', glyph: '◗', title: 'Fish + gear', note: 'Target species and their tackle' },
  { to: '/rigs', glyph: '⌁', title: 'Rigs + knots', note: 'Six rigs and the knots that hold them' },
  { to: '/care', glyph: '⚠', title: 'Handle with care', note: 'The animals that can hurt you' },
];

/** 404. A dead end is still a page: name the problem, then hand back the map. */
export default function NotFound() {
  return (
    <>
      <div className="sect">
        <div className="lab lab-blue">404</div>
        <h1 style={{ margin: '4px 0 8px' }}>Page not found</h1>
        <p className="mut">
          That address does not match anything in the guide — it may have been a typo, an old link,
          or a page that has not been built yet. Everything the guide does have is one tap away.
        </p>
        <p className="mt4">
          <Link className="btn btn-blue" to="/">
            Back to the guide
          </Link>
        </p>
      </div>

      <section className="sect" aria-labelledby="nf-h" style={{ paddingBottom: 'var(--s7)' }}>
        <SectionTitle id="nf-h">Everything in the guide</SectionTitle>
        <div className="card">
          {SECTIONS.map((s) => (
            <LinkRow key={s.to} to={s.to} glyph={s.glyph} title={s.title} note={s.note} />
          ))}
        </div>
      </section>
    </>
  );
}
