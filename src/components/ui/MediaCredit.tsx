import type { MediaRef } from '../../data';

/**
 * Visible attribution line for a licensed image.
 *
 * Several of the identification photos are Creative Commons (CC BY / CC BY-SA),
 * which legally require the credit to be visible — not buried in a title
 * attribute or a source file. This renders whenever the `MediaRef` carries a
 * `license` and/or a `source_url`, and renders nothing at all when it carries
 * neither, so unlicensed placeholder slots stay clean and any future licensed
 * media is credited automatically.

 *
 * Pairs with `Plate` / `IdPlate`: render it directly beneath the plate whose
 * media it credits. `src/test/media.test.ts` fails the build if a licensed
 * image renders anywhere without its credit, so this cannot be quietly
 * forgotten when a new plate is added.
 */
export function MediaCredit({ media }: { media?: MediaRef | null }) {
  if (!media || (!media.license && !media.source_url)) return null;

  return (
    <p className="credit">
      {media.license ?? 'Image source'}
      {media.source_url && (
        <>
          {' · '}
          <a href={media.source_url} target="_blank" rel="noreferrer">
            source<span aria-hidden="true"> ↗</span>
            <span className="vh">(opens in a new tab)</span>
          </a>
        </>
      )}
    </p>
  );
}

export default MediaCredit;
