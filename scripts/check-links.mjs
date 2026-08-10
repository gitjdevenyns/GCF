#!/usr/bin/env node
/**
 * External link health check.
 *
 * Deliberately NOT part of `npm test`: it hits the network, so it would make the
 * suite flaky and slow. Run it manually (`npm run check:links`) before a release
 * or when auditing content provenance.
 *
 * KNOWN_ISSUES.md #2 — many images are hotlinked from third-party hosts that may
 * block embedding, disappear, or change. This is how we find that out on purpose
 * instead of a user finding out in the field.
 *
 * Exit code is 1 if any URL is definitively broken (4xx/5xx or DNS failure).
 * Hosts that refuse HEAD/GET from a script but work in a browser are reported
 * separately as "blocked" and do not fail the run.
 *
 * Image URLs are held to a stricter standard than page links, because the two
 * fail differently. A page that 403s a script usually still opens for a reader
 * who clicks it; an <img> that 403s is simply blank on the screen. So images are
 * fetched the way the browser fetches them — image Accept header, real referer —
 * and are only "ok" if the response is genuinely an image. A 403, or a 200
 * carrying an HTML error page, counts as broken. That distinction is what turns
 * up a rotted hotlink instead of filing it under "probably fine".
 */
import { LOCATIONS, FISH, HAZARDS, HABITATS, VIDEOS, TIDE_GUIDE, SOURCES } from '../src/data/index.ts';

const TIMEOUT_MS = 15000;
const CONCURRENCY = 6;
const UA =
  'Mozilla/5.0 (compatible; gcf-link-check/1.0; +https://gitjdevenyns.github.io/GCF/)';
/**
 * Some hosts (myfwc.com among them) serve a 403/500 to anything that doesn't
 * look like a real browser. A URL is only reported broken if it also fails with
 * this UA, so bot filtering isn't mistaken for rot.
 */
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

/** The page the images are embedded on — some hosts vary on the referer. */
const REFERER = 'https://gitjdevenyns.github.io/GCF/';
const IMAGE_ACCEPT = 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8';

/**
 * Collect every outbound URL with a label saying where it lives, and whether it
 * is rendered as an image (checked strictly) or linked as a page.
 */
function collect() {
  const urls = new Map(); // url -> { wheres: Set<string>, image: boolean }
  const add = (url, where, image = false) => {
    if (!url) return;
    if (!urls.has(url)) urls.set(url, { wheres: new Set(), image: false });
    const entry = urls.get(url);
    entry.wheres.add(where);
    // If a URL is embedded anywhere, it has to survive the image check.
    entry.image ||= image;
  };

  for (const f of FISH) f.images.forEach((m, i) => add(m.url, `fish/${f.id} image[${i}]`, true));
  for (const h of HAZARDS) {
    if (h.image) add(h.image.url, `hazard/${h.id} image`, true);
    h.injury_media.forEach((m, i) => {
      // Injury media are linked as citations on /care, never embedded.
      add(m.url, `hazard/${h.id} injury[${i}]`);
      add(m.source_url, `hazard/${h.id} injury[${i}] source`);
    });
  }
  for (const h of HABITATS)
    h.photos.forEach((m, i) => add(m.url, `habitat/${h.id} photo[${i}]`, true));
  for (const v of VIDEOS) add(v.url, `video/${v.title}`);
  for (const s of TIDE_GUIDE.stations) add(s.url, `tide station/${s.area}`);
  for (const s of SOURCES) add(s.url, `source/${s.id}`);
  for (const l of LOCATIONS) {
    l.images.forEach((m, i) => add(m.url, `location/${l.slug} image[${i}]`, true));
    l.sources.forEach((s) => add(s.url, `location/${l.slug} source/${s.id}`));
    if (l.tide_station.url) add(l.tide_station.url, `location/${l.slug} tide station`);
  }
  for (const m of [...FISH.flatMap((f) => f.images), ...HAZARDS.map((h) => h.image), ...HABITATS.flatMap((h) => h.photos)]) {
    if (m?.source_url) add(m.source_url, 'media provenance', false);
  }
  return urls;
}

/**
 * Fetch an image exactly as the browser would and insist it really is one.
 * Anything else — a 403 from hotlink protection, an HTML "not found" page
 * served with a 200 — would render as an empty slot for a reader.
 */
async function probeImage(url, attempt = 0) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctl.signal,
      headers: { 'User-Agent': BROWSER_UA, Accept: IMAGE_ACCEPT, Referer: REFERER },
    });
    // Wikimedia rate-limits a burst of parallel requests from one address. That
    // is this script being impolite, not a rotted URL: back off and ask again.
    if (res.status === 429) {
      if (attempt >= 2) return { state: 'blocked', status: '429 rate-limited' };
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      return probeImage(url, attempt + 1);
    }
    const type = res.headers.get('content-type') ?? '';
    if (!res.ok) return { state: 'broken', status: res.status };
    if (!/^image\//i.test(type))
      return { state: 'broken', status: `${res.status} ${type || 'no content-type'}` };
    return { state: 'ok', status: res.status };
  } catch (e) {
    const msg = e?.cause?.code ?? e?.name ?? String(e);
    if (msg === 'AbortError' || msg === 'TimeoutError') return { state: 'blocked', status: 'timeout' };
    return { state: 'broken', status: msg };
  } finally {
    clearTimeout(timer);
  }
}

async function probe(url) {
  const attempt = async (method, ua) => {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        signal: ctl.signal,
        headers: { 'User-Agent': ua, Accept: '*/*' },
      });
      return { status: res.status };
    } finally {
      clearTimeout(timer);
    }
  };

  const classify = (status) => {
    if (status >= 200 && status < 400) return 'ok';
    // Hotlink protection / bot filtering, not a dead URL.
    if (status === 401 || status === 403 || status === 429) return 'blocked';
    return 'broken';
  };

  try {
    // HEAD first (cheap); many CDNs reject it, so fall back to GET.
    let { status } = await attempt('HEAD', UA);
    if (status === 405 || status === 403 || status === 501) {
      ({ status } = await attempt('GET', UA));
    }
    let state = classify(status);

    // Second opinion with a browser UA before condemning a URL.
    if (state !== 'ok') {
      try {
        const retry = await attempt('GET', BROWSER_UA);
        const retryState = classify(retry.status);
        if (retryState === 'ok') return { state: 'ok', status: retry.status };
        if (retryState === 'blocked') return { state: 'blocked', status: retry.status };
        status = retry.status;
        state = retryState;
      } catch {
        /* keep the original verdict */
      }
    }
    return { state, status };
  } catch (e) {
    const msg = e?.cause?.code ?? e?.name ?? String(e);
    if (msg === 'AbortError' || msg === 'TimeoutError') return { state: 'blocked', status: 'timeout' };
    return { state: 'broken', status: msg };
  }
}

async function main() {
  const urls = [...collect().entries()];
  const imageCount = urls.filter(([, e]) => e.image).length;
  console.log(
    `Checking ${urls.length} external URLs (${imageCount} of them embedded images)...\n`,
  );

  const results = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (cursor < urls.length) {
        const [url, entry] = urls[cursor++];
        const r = entry.image ? await probeImage(url) : await probe(url);
        results.push({ url, wheres: [...entry.wheres], image: entry.image, ...r });
        process.stdout.write(r.state === 'ok' ? '.' : r.state === 'blocked' ? '?' : 'X');
      }
    }),
  );
  process.stdout.write('\n\n');

  const by = (s) => results.filter((r) => r.state === s);
  const broken = by('broken');
  const blocked = by('blocked');

  console.log(`ok:      ${by('ok').length}`);
  console.log(`blocked: ${blocked.length}  (bot/hotlink protection or timeout — verify by hand)`);
  console.log(`broken:  ${broken.length}\n`);

  const line = (mark, r) =>
    `${mark} ${r.status}  ${r.image ? '[image] ' : ''}${r.url}\n    ${r.wheres.join('\n    ')}`;

  for (const r of blocked) console.log(line('?', r));
  if (blocked.length) console.log('');
  for (const r of broken) console.log(line('X', r));

  process.exit(broken.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
