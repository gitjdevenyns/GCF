import type { TidePlaybook, TideStage } from '../data';
import { TideStageGlyph } from './location/art';
import { zonesForStage } from './location/zones';
import type { Zone } from './location/zones';

const STAGES: Array<{ key: TideStage; label: string }> = [
  { key: 'low', label: 'Low' },
  { key: 'incoming', label: 'Incoming' },
  { key: 'high', label: 'High' },
  { key: 'outgoing', label: 'Outgoing' },
];

/**
 * Four-stage LOW → INCOMING → HIGH → OUTGOING timeline (design board 02).
 *
 * Stage copy is the location's own tide playbook. The "focus zones" line
 * reuses the page's numbered-zone convention: it lists the zones whose
 * structure type typically fishes best on that stage, so the same numbers tie
 * the diagram, the tide and the species cards together.
 */
export default function TideTimeline({
  playbook,
  zones = [],
}: {
  playbook: TidePlaybook;
  zones?: Zone[];
}) {
  return (
    <ol className="tideline plainlist">
      {STAGES.map((s, i) => {
        const prime = playbook.prime_stages.includes(s.key);
        const focus = zonesForStage(zones, s.key);
        return (
          <li key={s.key} className={`tidestage${prime ? ' is-prime' : ''}`}>
            <div className="glyph">
              <TideStageGlyph stage={s.key} prime={prime} />
            </div>
            <div>
              <p className="k">
                STAGE {i + 1}
                {prime && (
                  <>
                    {' · '}
                    <span className="lab-lime">PRIME</span>
                  </>
                )}
              </p>
              <h3>{s.label}</h3>
              <p className="mut">{playbook[s.key]}</p>
              {focus.length > 0 && (
                <p className="zonepins">
                  <span>Focus zones:</span>
                  {focus.map((z) => (
                    <span key={z.n}>
                      <span className="zonepin">{z.n}</span> {z.title}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
